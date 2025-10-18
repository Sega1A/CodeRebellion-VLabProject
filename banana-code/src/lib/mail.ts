import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: `"Soporte" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verifica tu cuenta",
    html: `
      <h1>Verifica tu cuenta</h1>
      <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${verifyUrl}">Verificar cuenta</a>
    `,
  });
}
