import { ensureAdminExists } from "@/scripts/ensureAdmin";
import LoginForm from "../app/components/login-form";

export default function LoginPage() {
  // Create an Admin user
  ensureAdminExists();
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}
