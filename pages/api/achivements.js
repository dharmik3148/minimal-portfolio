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
    const data = await prisma.achievement.findMany({
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).send({ status: true, message: "Success", data });
  } else if (req.method === "POST") {
    try {
      await runMiddleware(req, res, upload.array("photos"));

      const { title, link, date, description } = req.body;
      const folder = req.query.folder;

      let imagePath = null;

      if (req.files && req.files.length > 0) {
        imagePath = `api/uploads/${folder}/${req.files[0].filename}`;
      }

      await prisma.achievement.create({
        data: {
          title,
          link,
          imagepath: imagePath,
          date,
          description,
        },
      });

      return res
        .status(200)
        .send({ status: true, message: "Achivement saved" });
    } catch (error) {
      return res.status(200).send({
        status: false,
        message: "Something went wrong" + error.message,
      });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    const data = await prisma.achievement.findFirst({
      where: { id: parseInt(id) },
    });

    if (!data) {
      return res
        .status(200)
        .send({ status: false, message: "Achivement not found" });
    }

    await deleteFile(data.imagepath);

    await prisma.achievement.delete({
      where: {
        id: parseInt(data.id),
      },
    });

    return res
      .status(200)
      .send({ status: true, message: "Achivement Deleted" });
  } else {
    return res
      .status(200)
      .json({ message: "Something went wrong", status: false });
  }
}
