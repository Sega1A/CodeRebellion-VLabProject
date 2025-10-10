import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return new Response(JSON.stringify({ error: "Usuario existente" }), {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, name, password: hashedPassword },
  });
  return Response.json(newUser);
}
