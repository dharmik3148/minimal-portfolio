import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const { file } = req.query;

  const filePath = path.join(process.cwd(), "uploads", ...file);

  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath);

      const ext = path.extname(filePath).slice(1);
      const mimeTypes = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        gif: "image/gif",
        pdf: "application/pdf",
        mp3: "audio/mpeg",
        wav: "audio/wav",
        mp4: "video/mp4",
      };

      const contentType = mimeTypes[ext] || "application/octet-stream";
      res.setHeader("Content-Type", contentType);

      res.status(200).send(fileContent);
    } else {
      res.status(200).send("Broken Link");
    }
  } catch (error) {
    res.status(200).send("Server error");
  }
}
