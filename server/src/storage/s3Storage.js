import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";

const PRIVATE_PREFIX = "private/";

export const createS3Storage = () => {
  const { bucket, privateBucket, region, endpoint, accessKeyId, secretAccessKey, publicUrl } = env.storage.s3;

  const client = new S3Client({
    region,
    endpoint,
    forcePathStyle: Boolean(endpoint),
    credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
  });

  const keyFromUrl = (url) =>
    typeof url === "string" && url.startsWith(`${publicUrl}/`) ? url.slice(publicUrl.length + 1) : null;

  const privateObject = (key) => ({ Bucket: privateBucket, Key: `${PRIVATE_PREFIX}${key}` });

  return {
    init() {},

    async save({ key, buffer, contentType }) {
      await client.send(
        new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType })
      );
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

    async savePrivate({ key, buffer, contentType }) {
      await client.send(
        new PutObjectCommand({ ...privateObject(key), Body: buffer, ContentType: contentType })
      );
      return key;
    },

    async readPrivate(key) {
      const { Body } = await client.send(new GetObjectCommand(privateObject(key)));
      return Body;
    },

    async removePrivate(key) {
      await client.send(new DeleteObjectCommand(privateObject(key)));
    },
  };
};
