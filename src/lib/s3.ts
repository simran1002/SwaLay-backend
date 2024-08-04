// lib/s3.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION as string,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY as string,
    },
  });

export async function uploadFileToS3(fileBuffer: Buffer, fileName: string): Promise<string> {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: `music/${fileName}-${Date.now()}`,
    Body: fileBuffer,
    ContentType: 'audio/mpeg', // Update this based on your file type
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `${fileName}-${Date.now()}`;
}
