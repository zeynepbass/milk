import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";

export const createS3Storage = () => {
  const { bucket, region, endpoint, accessKeyId, secretAccessKey, publicUrl } = env.storage.s3;

  const client = new S3Client({
    region,
    endpoint,
    forcePathStyle: Boolean(endpoint),
    credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
  });

  const keyFromUrl = (url) =>
    typeof url === "string" && url.startsWith(`${publicUrl}/`) ? url.slice(publicUrl.length + 1) : null;

  return {
    init() {},

    async save({ key, buffer, contentType }) {
      await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType }));
      return `${publicUrl}/${key}`;
    },

    async remove(url) {
      const key = keyFromUrl(url);
      if (!key) return;
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    },

    owns(url) {
      return Boolean(keyFromUrl(url));
    },
  };
};
