import prisma from "@/lib/prisma";
import { getToken } from "@/utils/helper";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { token, userid } = req.headers;

    if (!userid || !token) {
      return res.status(200).send({
        status: false,
        message: "Authorization failed",
      });
    }

    const data = await prisma.userSession.findFirst({
      where: { userId: parseInt(userid), token },
    });

    if (!data) {
      return res
        .status(200)
        .send({ status: false, message: "Authorization failed" });
    }

    return res
      .status(200)
      .send({ status: true, message: "Authorization Success" });
  } else if (req.method === "PUT") {
    const { username, password } = req.query;

    if (!username || !password) {
      return res
        .status(200)
        .send({ status: false, message: "username & password required" });
    }

    const isExist = await prisma.user.findFirst({
      where: { username: username },
    });

    if (isExist) {
      return res
        .status(200)
        .send({ status: false, message: "Username Already Exist" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await prisma.user.create({
      data: { username, password: hash },
    });

    return res.status(200).send({ status: true, message: "Username Created" });
  } else if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(200)
        .send({ status: false, message: "Username & Password required" });
    }

    const isUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!isUser) {
      return res.status(200).json({
        message: "User not found",
        status: false,
      });
    }

    if (!bcrypt.compareSync(password, isUser.password)) {
      return res.status(200).json({
        message: "Invalid password",
        status: false,
      });
    }

    const token = `${isUser.username}-${await getToken(isUser.id)}`;

    await prisma.userSession.create({
      data: {
        token: token,
        userId: isUser.id,
      },
    });

    return res.status(200).json({
      message: "Login successful",
      id: isUser.id,
      token,
      status: true,
    });
  } else if (req.method === "DELETE") {
    const { token, userId } = req.body;

    if (!userId || !token) {
      return res
        .status(200)
        .send({ status: false, message: "Authorization failed" });
    }

    const admin = await prisma.userSession.findFirst({
      where: {
        token,
        userId,
      },
    });

    if (!admin) {
      return res
        .status(200)
        .send({ status: false, message: "Authorization failed" });
    }

    await prisma.userSession.deleteMany({
      where: {
        userId: admin.userId,
      },
    });

    return res.status(200).send({
      status: true,
      message: "Logged out successfully",
    });
  } else {
    return res
      .status(200)
      .json({ message: "Something went wrong", status: false });
  }
}
