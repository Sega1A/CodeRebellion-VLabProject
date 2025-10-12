import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return new Response(JSON.stringify({ error: "El usuario ya existe" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expireTime = Date.now() + 15 * 60 * 1000; //15 min
    const expires = new Date(expireTime);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    await sendVerificationEmail(email, token);

    return new Response(
      JSON.stringify({
        message:
          "Usuario registrado. Revisa tu correo para verificar tu cuenta.",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
