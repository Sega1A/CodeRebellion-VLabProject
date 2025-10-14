import { UserService } from "@/services/user.service";
import { NextResponse } from "next/server";

export const UserController = {
  async listUsers() {
    try {
      const users = await UserService.listUsers();
      return NextResponse.json(users);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Error al obtener usuarios" },
        { status: 500 }
      );
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
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Error al cambiar rol" },
        { status: 500 }
      );
    }
  },
};
