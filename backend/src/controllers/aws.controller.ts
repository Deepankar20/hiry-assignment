import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
//@ts-ignore
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

require("dotenv").config();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

async function putObject(filename: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: "videostore20",
    Key: `${filename}`,
    ContentType: contentType,
  });

  const putObjectUrl = await getSignedUrl(s3Client, command);

  return putObjectUrl;
}

export const getURL = async (req: any, res: any) => {
  const { filename, contentType } = req.query;

  const url = await putObject(filename, contentType);

  if (url) {
    res.status(201).json({
      message: "url generated",
      url: url,
    });
  }
};
