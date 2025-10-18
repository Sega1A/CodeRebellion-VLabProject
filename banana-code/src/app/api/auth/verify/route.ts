import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("Token no obtenido", { status: 400 });
  }

  const tokenData = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!tokenData || tokenData.expires < new Date()) {
    return new Response("Token invalido o expirado", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: tokenData.identifier },
  });
  if (!user) {
    return new Response("Usuario no encontrado", { status: 404 });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return new Response("Cuenta verificada", { status: 200 });
}
