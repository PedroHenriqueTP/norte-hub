import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface IStorageProvider {
    upload(file: File, path: string): Promise<string>;
    delete(path: string): Promise<void>;
    getSignedUploadUrl(path: string, type: string): Promise<{ url: string; fields: Record<string, string> }>;
}

export class S3StorageProvider implements IStorageProvider {
    private client: S3Client;
    private bucket: string;

    constructor() {
        this.client = new S3Client({
            region: process.env.AWS_REGION || "us-east-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
            },
        });
        this.bucket = process.env.AWS_BUCKET_NAME || "";
    }

    async upload(file: File, path: string): Promise<string> {
        // Direct upload from server (avoid if possible, use signed url)
        // This method is just a placeholder implementation for the interface
        throw new Error("Use getSignedUploadUrl for better performance");
    }

    async delete(path: string): Promise<void> {
        await this.client.send(new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: path
        }));
    }

    async getSignedUploadUrl(path: string, contentType: string) {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: path,
            ContentType: contentType
        });

        const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });
        return { url, fields: {} };
    }
}
