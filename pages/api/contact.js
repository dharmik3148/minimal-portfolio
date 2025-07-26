import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const data = await prisma.contact.findMany({});

    return res.status(200).send({ status: true, message: "Success", data });
  } else if (req.method === "POST") {
    try {
      const { title, value, iconName } = req.body;

      await prisma.contact.create({
        data: {
          title,
          value,
          iconName,
        },
      });

      return res.status(200).send({ status: true, message: "Contact created" });
    } catch (error) {
      return res.status(200).send({ status: true, message: error.message });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    const data = await prisma.contact.findFirst({
      where: { id: parseInt(id) },
    });

    if (!data) {
      return res
        .status(200)
        .send({ status: false, message: "Contact not found" });
    }

    await prisma.contact.delete({
      where: { id: parseInt(data.id) },
    });

    return res.status(200).send({ status: true, message: "Contact Deleted" });
  } else {
    return res
      .status(200)
      .json({ message: "Something went wrong", status: false });
  }
}
