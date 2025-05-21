const { suid } = require("rand-token");
import fs from "fs";
import path from "path";

export const getToken = async (adminUser) => {
  const token = adminUser + suid(99);
  return token;
};

export async function deleteFile(relativeFilePath) {
  try {
    if (relativeFilePath.startsWith("api/uploads/")) {
      relativeFilePath = relativeFilePath.slice("api/uploads/".length);
    }

    const filePath = path.join(process.cwd(), "uploads", relativeFilePath);

    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      console.warn("Tried to delete a directory, not a file:", filePath);
      return false;
    }

    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn("File not found:", relativeFilePath);
      return false;
    } else {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}

export default function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
