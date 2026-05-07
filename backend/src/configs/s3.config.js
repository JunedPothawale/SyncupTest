import { S3Client } from "@aws-sdk/client-s3";

let s3 = null;

if (
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY &&
    process.env.AWS_SECRET_KEY
) {
    s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        },
    });
}

export { s3 };