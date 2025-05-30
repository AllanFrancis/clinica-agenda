import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error("AWS_ACCESS_KEY_ID não está configurada");
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS_SECRET_ACCESS_KEY não está configurada");
}

if (!process.env.AWS_REGION) {
  throw new Error("AWS_REGION não está configurada");
}

if (!process.env.AWS_BUCKET_NAME) {
  throw new Error("AWS_BUCKET_NAME não está configurada");
}

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateUploadURL(fileName: string, fileType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
  });

  const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return uploadURL;
}

export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  fileType: string,
) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: fileType,
  });

  try {
    await s3Client.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error);
    throw error;
  }
}

export async function listFilesInBucket() {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME,
  });
  const response = await s3Client.send(command);
  return response.Contents?.map((obj) => obj.Key) || [];
}

export async function deleteFileFromS3(fileName: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    throw error;
  }
}
