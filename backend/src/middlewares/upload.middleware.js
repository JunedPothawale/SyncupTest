import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import fs from "fs";
import { s3 } from "../configs/s3.config.js";

// 📂 local folder

const uploadDir = `public/uploads/resumes`;
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔍 check if S3 is usable
const isS3Available =
    s3 && process.env.AWS_BUCKET;

// ==============================
// 🟢 Local storage
// ==============================
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// ==============================
// 🔵 S3 storage (ONLY if valid)
// ==============================
let storage;

if (isS3Available) {
    storage = multerS3({
        s3,
        bucket: process.env.AWS_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, `resumes/${Date.now()}-${file.originalname}`);
        },
    });
} else {
    storage = localStorage;
}

// ==============================
// 🚀 Export
// ==============================
export const upload = multer({ storage });