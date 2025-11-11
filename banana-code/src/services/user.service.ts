import { UserRepository } from "@/repositories/user.repository";
import { User } from "@prisma/client";

export const UserService = {
  async listUsers() {
    return await UserRepository.getUsers();
  },

  async changeUserRole(id: string, role: User["role"]) {
    const user = await UserRepository.findById(id);

    if (role === "ADMINISTRADOR") {
      throw new Error("No se puede asignar el rol de administrador");
    }

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (user.role === "ADMINISTRADOR") {
      throw new Error("No se puede cambiar el rol de un administrador");
    }

    return await UserRepository.changeRole(id, role);
  },
  async findUserById(id: string) {
    return await UserRepository.findById(id);
  },
};
