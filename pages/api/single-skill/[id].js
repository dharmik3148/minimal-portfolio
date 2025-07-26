import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    const skill = await prisma.skills.findFirst({
      where: { id: parseInt(id) },
    });

    const cat = await prisma.skills.findMany({
      select: {
        category: true,
      },
    });

    const uniqueCategories = [...new Set(cat.map((skill) => skill.category))];

    if (!skill) {
      return res
        .status(200)
        .json({ message: "No experience found ", status: false });
    }

    return res.status(200).json({
      message: "Success",
      status: true,
      data: skill,
      category: uniqueCategories,
    });
  } else {
    return res
      .status(200)
      .json({ message: "Something went wrong", status: false });
  }
}
