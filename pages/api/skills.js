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
    const data = await prisma.skills.findMany();

    return res.status(200).json({ message: "Success", status: true, data });
  } else if (req.method === "POST") {
    try {
      await runMiddleware(req, res, upload.array("photos"));

      const { skillname, category } = req.body;

      const folder = req.query.folder;

      let imagePath = null;

      if (req.files && req.files.length > 0) {
        imagePath = `uploads/${folder}/${req.files[0].filename}`;
      }

      await prisma.skills.create({
        data: {
          skillname,
          logopath: imagePath,
          category,
        },
      });

      return res.status(200).send({ status: true, message: "Skill Created" });
    } catch (error) {
      return res.status(200).send({
        status: false,
        message: "Something went wrong" + error.message,
      });
    }
  } else if (req.method === "PUT") {
    const data = await prisma.skills.findMany({
      select: {
        category: true,
      },
    });

    const uniqueCategories = [...new Set(data.map((skill) => skill.category))];

    return res
      .status(200)
      .json({ message: "success", status: true, data: uniqueCategories });
  } else if (req.method === "PATCH") {
    try {
      await runMiddleware(req, res, upload.array("photos"));

      const { id, skillname, category } = req.body;
      const folder = req.query.folder;

      let imagePath = undefined;

      if (req.files && req.files.length > 0) {
        imagePath = `uploads/${folder}/${req.files[0].filename}`;
      }

      const lookExp = await prisma.skills.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (imagePath) {
        await deleteFile(lookExp.logopath);
      }

      await prisma.skills.update({
        where: { id: parseInt(id) },
        data: {
          skillname,
          category,
          ...(imagePath && { logopath: imagePath }),
        },
      });

      return res.status(200).send({ status: true, message: "Skill updated" });
    } catch (error) {
      return res.status(200).send({
        status: false,
        message: "Something went wrong" + error.message,
      });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    const data = await prisma.skills.findFirst({
      where: { id: parseInt(id) },
    });

    if (!data) {
      return res
        .status(200)
        .send({ status: false, message: "Skill not found" });
    }

    await deleteFile(data.logopath);

    await prisma.skills.delete({
      where: { id: parseInt(data.id) },
    });

    return res.status(200).send({ status: true, message: "Skill Deleted" });
  } else {
    return res
      .status(200)
      .json({ message: "Something went wrong", status: false });
  }
}
