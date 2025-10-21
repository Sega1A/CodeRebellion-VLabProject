import { UserController } from "@/controllers/user.controller";

export const GET = () => UserController.listUsers();
export const PUT = (req: Request) => UserController.changeUserRole(req);
