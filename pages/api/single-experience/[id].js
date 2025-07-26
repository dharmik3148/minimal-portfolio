import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    const exp = await prisma.experience.findFirst({
      where: { id: parseInt(id) },
    });

    if (!exp) {
      return res
        .status(200)
        .json({ message: "No experience found ", status: false });
    }

    return res
      .status(200)
      .json({ message: "Success", status: true, data: exp });
  } else {
    return res
      .status(200)
      .json({ message: "Something went wrong", status: false });
  }
}
