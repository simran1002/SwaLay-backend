import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import md5 from 'md5';
import { Readable } from 'stream';

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
    }
  });
  return stream;
};

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
      throw new Error('Missing required parameters');
    }

    // Create directory if not exists
    const chunksDir = path.join(process.cwd(), 'uploads', fileName);
    if (!fs.existsSync(chunksDir)) {
      fs.mkdirSync(chunksDir, { recursive: true });
    }

    // Define path for the current chunk
    const chunkPath = path.join(chunksDir, `${fileName}-chunk-${chunkIndex}`);
    const fileStream = fs.createWriteStream(chunkPath);

    // Pipe the request body (chunk) to the file stream
    const nodeStream = streamToNodeStream(req.body as ReadableStream<Uint8Array>);
    nodeStream.pipe(fileStream);

    return new Promise((resolve, reject) => {
      fileStream.on('close', async () => {
        const chunkIndexNumber = parseInt(chunkIndex, 10);
        const chunkCountNumber = parseInt(chunkCount, 10);

        // Calculate progress
        const progress = `${chunkIndexNumber + 1} of ${chunkCountNumber} chunks uploaded`;
        const percentage = `${((chunkIndexNumber + 1) / chunkCountNumber) * 100}%`;

        // If all chunks are received, combine them into a final file
        if (chunkIndexNumber + 1 === chunkCountNumber) {
          const finalPath = path.join(process.cwd(), 'uploads', fileName);
          const writeStream = fs.createWriteStream(finalPath);
          for (let i = 0; i < chunkCountNumber; i++) {
            const chunkFilePath = path.join(chunksDir, `${fileName}-chunk-${i}`);
            const data = fs.readFileSync(chunkFilePath);
            writeStream.write(data);
            fs.unlinkSync(chunkFilePath); // Remove chunk file
          }
          writeStream.end();
          fs.rmdirSync(chunksDir); // Remove chunks directory

          // Verify MD5 hash
          const finalBuffer = fs.readFileSync(finalPath);
          const finalHash = md5(finalBuffer);

          if (finalHash !== hash) {
            fs.unlinkSync(finalPath); // Remove the final file if hash mismatch
            return resolve(NextResponse.json({ message: 'Hash mismatch' }, { status: 400 }));
          }
        }
        resolve(
          NextResponse.json({
            status: 'success',
            data: {
              message: 'Chunk uploaded',
              percentage,
              progress
            }
          })
        );
      });

      fileStream.on('error', (err) => {
        reject(
          NextResponse.json({ message: 'Error uploading chunk', error: err.message }, { status: 500 })
        );
      });
    });
  } catch (error: any) {
    console.error('Error processing file upload:', error);
    return NextResponse.json({ message: 'Error uploading chunk', error: error.message }, { status: 400 });
  }
}
