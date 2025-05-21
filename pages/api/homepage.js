import prisma from "@/lib/prisma";
import { deleteFile } from "@/utils/helper";
import { upload } from "@/utils/multer";
import { Home } from "lucide-react";

export const config = {
  api: { bodyParser: false },
};

const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });

export default async function handler(req, res) {
  if (req.method === "GET") {
    const data = await prisma.homepage.findFirst();

    if (!data) {
      return res
        .status(200)
        .send({ status: true, message: "Please add new data", data });
    }

    return res.status(200).send({ status: true, message: "Success", data });
  } else if (req.method === "PATCH") {
    try {
      await runMiddleware(
        req,
        res,
        upload.fields([
          { name: "imagepath", maxCount: 1 },
          { name: "musicpath", maxCount: 1 },
          { name: "resumepath", maxCount: 1 },
        ])
      );

      const { hone, htwo, content } = req.body;
      const folder = req.query.folder;

      let imagePath = "";
      let musicPath = "";
      let resumePath = "";

      if (req.files?.imagepath?.[0]) {
        imagePath = `api/uploads/${folder}/${req.files.imagepath[0].filename}`;
      }
      if (req.files?.musicpath?.[0]) {
        musicPath = `api/uploads/${folder}/${req.files.musicpath[0].filename}`;
      }
      if (req.files?.resumepath?.[0]) {
        resumePath = `api/uploads/${folder}/${req.files.resumepath[0].filename}`;
      }
      const homepage = await prisma.homepage.findFirst();

      if (!homepage) {
        // CREATE new homepage
        await prisma.homepage.create({
          data: {
            hone: hone || "",
            htwo: htwo || "",
            content: content || "",
            imagepath: imagePath,
            musicpath: musicPath,
            resumepath: resumePath,
          },
        });

        return res
          .status(200)
          .send({ status: true, message: "Homepage created." });
      } else {
        if (imagePath != "") {
          await deleteFile(homepage.imagepath);
        }
        if (musicPath != "") {
          await deleteFile(homepage.musicpath);
        }
        if (resumePath != "") {
          await deleteFile(homepage.resumepath);
        }

        // UPDATE homepage
        await prisma.homepage.update({
          where: { id: homepage.id },
          data: {
            hone: hone ? hone : homepage.hone,
            htwo: htwo ? htwo : homepage.htwo,
            content: content ? content : homepage.content,
            ...(imagePath && { imagepath: imagePath }),
            ...(musicPath && { musicpath: musicPath }),
            ...(resumePath && { resumepath: resumePath }),
          },
        });

        return res
          .status(200)
          .send({ status: true, message: "Homepage updated." });
      }
    } catch (error) {
      return res
        .status(200)
        .send({ status: false, message: "Something went wrong!" });
    }
  } else {
    return res
      .status(200)
      .send({ status: false, message: "Something went wrong!" });
  }
}
