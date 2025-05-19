import { upload } from "@/utils/multer";
import prisma from "@/lib/prisma";
import { deleteFile } from "@/utils/helper";

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
    const data = await prisma.project.findMany({
      include: {
        images: true,
      },
    });

    return res.status(200).send({ status: true, message: "Success", data });
  } else if (req.method === "POST") {
    try {
      await runMiddleware(req, res, upload.array("photos"));

      const { title, details, github, livedemo, tags } = req.body;

      const folder = req.query.folder;

      if (!folder || !title) {
        return res
          .status(200)
          .send({ status: false, message: "title required" });
      }

      const project = await prisma.project.create({
        data: {
          title,
          details,
          github,
          livedemo,
          tags,
        },
      });

      const imageEntries = req.files.map((file) => {
        const imageData = {
          path: `uploads/${folder}/${file.filename}`,
          projectId: parseInt(project.id),
        };
        return prisma.image.create({
          data: imageData,
        });
      });

      await Promise.all(imageEntries);

      return res
        .status(200)
        .send({ status: true, message: "Project & Images saved" });
    } catch (error) {
      return res.status(200).send({
        status: false,
        message: "Something went wrong",
      });
    }
  } else if (req.method === "DELETE") {
    const { imageid } = req.headers;

    const image = await prisma.image.findFirst({
      where: {
        id: parseInt(imageid),
      },
    });

    if (!image) {
      return res
        .status(200)
        .json({ message: "image can't be found", status: false });
    }

    await deleteFile(image.path);

    await prisma.image.delete({ where: { id: parseInt(imageid) } });

    return res.status(200).send({ status: true, message: "Image deleted" });
  } else if (req.method === "PATCH") {
    try {
      await runMiddleware(req, res, upload.array("photos"));

      const { id, title, details, github, livedemo, tags } = req.body;

      const folder = req.query.folder;

      const existingProject = await prisma.project.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingProject) {
        return res
          .status(200)
          .send({ status: false, message: "Project not found" });
      }

      await prisma.project.update({
        where: { id: parseInt(id) },
        data: {
          title,
          details,
          github,
          livedemo,
          tags,
        },
      });

      if (req.files && req.files.length > 0) {
        const imageEntries = req.files.map((file) => {
          const imageData = {
            path: `uploads/${folder}/${file.filename}`,
            projectId: parseInt(id),
          };
          return prisma.image.create({
            data: imageData,
          });
        });

        await Promise.all(imageEntries);
      }

      return res
        .status(200)
        .send({ status: true, message: "Project updated successfully" });
    } catch (error) {
      return res.status(200).send({
        status: false,
        message: "Something went wrong",
      });
    }
  } else {
    return res
      .status(200)
      .json({ message: "Something went wrong", status: false });
  }
}
