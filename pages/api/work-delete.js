import prisma from "@/lib/prisma";
import { deleteFile } from "@/utils/helper";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      const data = await prisma.project.findFirst({
        where: { id: parseInt(id) },
        include: {
          images: { select: { id: true, path: true, projectId: true } },
        },
      });

      if (!data) {
        return res
          .status(200)
          .send({ status: false, message: "Work not found" });
      }

      const deleteImages = data.images.map(async (img) => {
        await deleteFile(img.path);
        return prisma.image.deleteMany({
          where: { id: parseInt(img.id) },
        });
      });

      await Promise.all(deleteImages);

      await prisma.project.delete({ where: { id: parseInt(data.id) } });

      return res.status(200).send({ status: true, message: "Work Deleted" });
    } catch (error) {
      return res.status(200).send({ status: false, message: error.message });
    }
  } else {
    return res
      .status(200)
      .json({ message: "Something went wrong", status: false });
  }
}
