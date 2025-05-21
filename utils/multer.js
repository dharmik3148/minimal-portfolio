import multer from "multer";
import path from "path";
import randToken from "rand-token";
import fs from "fs";
import crypto from "crypto";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.query.folder;
    const uploadPath = path.join("uploads", folder);
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const randomString = randToken.generate(10);
    cb(null, `${crypto.randomBytes(7).toString("hex")}${randomString}${ext}`);
  },
});

export const upload = multer({ storage });
