import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import response from '@/lib/response';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY as string,
  },
});

const streamToNodeStream = (readableStream: ReadableStream<Uint8Array>): Readable => {
  const reader = readableStream.getReader();
  const stream = new Readable({
    read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      });
    },
  });
  return stream;
};

async function uploadChunkToS3(chunkBuffer: Buffer, fileName: string, chunkIndex: number) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
    Key: `uploads/${fileName}-chunk-${chunkIndex}`,
    Body: chunkBuffer,
    ContentType: 'application/octet-stream',
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract required parameters
    const fileName = searchParams.get('fileName');
    const chunkIndex = searchParams.get('chunkIndex');
    const chunkCount = searchParams.get('chunkCount');
    const hash = searchParams.get('hash');

    // Check if any required parameter is missing
    if (!fileName || !chunkIndex || !chunkCount || !hash) {
      return response(400, null, false, 'Missing required parameters').nextResponse;
    }

    // Convert ReadableStream to Buffer
    const nodeStream = streamToNodeStream(req.body as ReadableStream<Uint8Array>);
    const chunkBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      nodeStream.on('data', (chunk) => chunks.push(chunk));
      nodeStream.on('end', () => resolve(Buffer.concat(chunks)));
      nodeStream.on('error', (err) => reject(err));
    });

    // Upload the chunk to S3
    await uploadChunkToS3(chunkBuffer, fileName, parseInt(chunkIndex, 10));

    // Calculate progress
    const chunkIndexNumber = parseInt(chunkIndex, 10);
    const chunkCountNumber = parseInt(chunkCount, 10);
    const progress = `${chunkIndexNumber + 1} of ${chunkCountNumber} chunks uploaded`;
    const percentage = `${((chunkIndexNumber + 1) / chunkCountNumber) * 100}%`;

    // If all chunks are received, combine them into a final file
    if (chunkIndexNumber + 1 === chunkCountNumber) {
      const finalFileBuffer = await combineChunksFromS3(fileName, chunkCountNumber);
      const finalHash = crypto.createHash('md5').update(finalFileBuffer).digest('hex');

      if (finalHash !== hash) {
        await deleteChunksFromS3(fileName, chunkCountNumber);
        return response(400, null, false, 'Hash mismatch').nextResponse;
      }

      await uploadFileToS3(finalFileBuffer, fileName);
      await deleteChunksFromS3(fileName, chunkCountNumber);
    }

    return response(200, { message: 'Chunk uploaded', percentage, progress }, true, 'Success').nextResponse;
  } catch (error: any) {
    console.error('Error processing file upload:', error);
    return response(400, null, false, 'Error uploading chunk').nextResponse;
  }
}

async function combineChunksFromS3(fileName: string, chunkCount: number): Promise<Buffer> {
  const buffers: Buffer[] = [];

  for (let i = 0; i < chunkCount; i++) {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
      Key: `uploads/${fileName}-chunk-${i}`,
    };

    const command = new GetObjectCommand(params);
    const { Body } = await s3Client.send(command);
    const stream = Body as Readable;
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
    buffers.push(buffer);
  }

  return Buffer.concat(buffers);
}

async function deleteChunksFromS3(fileName: string, chunkCount: number) {
  for (let i = 0; i < chunkCount; i++) {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
      Key: `uploads/${fileName}-chunk-${i}`,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  }
}

async function uploadFileToS3(fileBuffer: Buffer, fileName: string) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
    Key: `final/${fileName}-${Date.now()}`,
    Body: fileBuffer,
    ContentType: 'application/octet-stream',
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `${fileName}-${Date.now()}`;
}
