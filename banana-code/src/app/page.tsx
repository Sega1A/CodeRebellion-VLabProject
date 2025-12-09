import { ensureAdminExists } from "@/scripts/ensureAdmin";
import LoginForm from "../app/components/login-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // ensureAdminExists();

  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}
