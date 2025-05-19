import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    const project = await prisma.project.findFirst({
      where: { id: parseInt(id) },
      include: {
        images: true,
      },
    });

    if (!project) {
      return res
        .status(200)
        .json({ message: "No work found for this project", status: false });
    }

    return res.status(200).json({ message: "Success", status: true, project });
  } else {
    return res
      .status(200)
      .json({ message: "Something went wrong", status: false });
  }
}
