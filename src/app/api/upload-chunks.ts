import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  const { searchParams } = new URL(req.url);
  const chunkIndex = searchParams.get('chunkIndex');
  const chunkCount = searchParams.get('chunkCount');
  const fileName = searchParams.get('fileName');

  const chunkIndexNumber = parseInt(chunkIndex as string, 10);
  const chunkCountNumber = parseInt(chunkCount as string, 10);

  const chunksDir = path.join(process.cwd(), 'uploads', fileName as string);
  if (!fs.existsSync(chunksDir)) {
    fs.mkdirSync(chunksDir, { recursive: true });
  }

  const chunkPath = path.join(chunksDir, `${fileName}-chunk-${chunkIndex}`);
  const fileStream = fs.createWriteStream(chunkPath);

  const nodeStream = streamToNodeStream(req.body as ReadableStream<Uint8Array>);
  nodeStream.pipe(fileStream);

  return new Promise((resolve, reject) => {
    fileStream.on('close', async () => {
      if (chunkIndexNumber + 1 === chunkCountNumber) {
        // All chunks received, combine them
        const finalPath = path.join(process.cwd(), 'uploads', fileName as string);
        const writeStream = fs.createWriteStream(finalPath);
        for (let i = 0; i < chunkCountNumber; i++) {
          const chunkPath = path.join(chunksDir, `${fileName}-chunk-${i}`);
          const data = fs.readFileSync(chunkPath);
          writeStream.write(data);
          fs.unlinkSync(chunkPath); // Remove chunk file
        }
        writeStream.end();
        fs.rmdirSync(chunksDir); // Remove chunks directory
      }
      resolve(NextResponse.json({ message: 'Chunk uploaded' }));
    });

    fileStream.on('error', (err) => {
      reject(NextResponse.json({ message: 'Error uploading chunk', error: err.message }));
    });
  });
}
