import { UserService } from "@/services/user.service";
import { NextResponse } from "next/server";

export const UserController = {
  async listUsers() {
    try {
      const users = await UserService.listUsers();
      return NextResponse.json(users);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al obtener usuarios";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },

  async changeUserRole(req: Request) {
    try {
      const { id, role } = await req.json();
      console.log(id, role);
      if (!id || !role) {
        return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
      }

      const updatedUser = await UserService.changeUserRole(id, role);
      return NextResponse.json(updatedUser);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al cambiar rol";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },
};
