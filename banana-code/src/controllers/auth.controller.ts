import { AuthService } from "@/services/user.service";

export async function registerController(req: Request) {
  const { email, password, name } = await req.json();
  const user = await AuthService.register(email, password, name);
  return Response.json(user);
}
