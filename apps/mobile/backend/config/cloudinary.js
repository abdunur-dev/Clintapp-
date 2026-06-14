import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

function createUploader(folder, allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"]) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "nbab-bet/" + folder,
      allowed_formats: allowedFormats,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    },
  });

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
      if (allowedFormats.includes(ext)) return cb(null, true);
      const mimeMatch = allowedFormats.some((f) => file.mimetype === `image/${f}` || file.mimetype === `image/${f === "jpg" ? "jpeg" : f}`);
      if (mimeMatch) return cb(null, true);
      cb(new Error("Only image files (jpg, png, gif, webp) are allowed"));
    },
  });
}

export { cloudinary, createUploader };
