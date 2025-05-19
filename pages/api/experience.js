import prisma from "@/lib/prisma";
import { deleteFile } from "@/utils/helper";
import { upload } from "@/utils/multer";

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
    const data = await prisma.experience.findMany({});

    return res.status(200).send({ status: true, message: "Success", data });
  } else if (req.method === "POST") {
    try {
      await runMiddleware(req, res, upload.array("photos"));

      const {
        organization,
        link,
        isWork,
        position,
        duration,
        location,
        description,
      } = req.body;

      const typeWork = isWork === "true";

      const folder = req.query.folder;

      if (!folder || !organization || !link) {
        return res
          .status(200)
          .send({ status: false, message: "fields required" });
      }

      let imagePath = null;

      if (req.files && req.files.length > 0) {
        imagePath = `uploads/${folder}/${req.files[0].filename}`;
      }

      await prisma.experience.create({
        data: {
          organization,
          link,
          isWork: typeWork,
          position,
          duration,
          location,
          description,
          image: imagePath,
        },
      });

      return res
        .status(200)
        .send({ status: true, message: "Experience saved" });
    } catch (error) {
      return res.status(200).send({
        status: false,
        message: "Something went wrong",
      });
    }
  } else if (req.method === "PATCH") {
    try {
      await runMiddleware(req, res, upload.array("photos"));

      const {
        id,
        organization,
        link,
        isWork,
        position,
        duration,
        location,
        description,
      } = req.body;

      const typeWork = isWork === "true";

      const folder = req.query.folder;

      let imagePath = undefined;

      if (req.files && req.files.length > 0) {
        imagePath = `uploads/${folder}/${req.files[0].filename}`;
      }

      const lookExp = await prisma.experience.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (imagePath) {
        await deleteFile(lookExp.image);
      }

      await prisma.experience.update({
        where: { id: parseInt(id) },
        data: {
          organization,
          link,
          isWork: typeWork,
          position,
          duration,
          location,
          description,
          ...(imagePath && { image: imagePath }),
        },
      });

      return res
        .status(200)
        .send({ status: true, message: "Experience updated" });
    } catch (error) {
      return res.status(200).send({
        status: false,
        message: "Something went wrong",
      });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    const data = await prisma.experience.findFirst({
      where: { id: parseInt(id) },
    });

    if (!data) {
      return res
        .status(200)
        .send({ status: false, message: "Experience not found" });
    }

    await deleteFile(data.image);

    await prisma.experience.delete({ where: { id: parseInt(data.id) } });

    return res
      .status(200)
      .send({ status: true, message: "Experience Deleted" });
  } else {
    return res
      .status(200)
      .json({ message: "Something went wrong", status: false });
  }
}
