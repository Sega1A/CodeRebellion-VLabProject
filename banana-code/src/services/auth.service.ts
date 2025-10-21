import { UserRepository } from "@/repositories/user.repository";
import bcrypt from "bcrypt";
import { User, Role } from "@prisma/client";

export const AuthService = {
  async register(email: string, password: string, name?: string) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }

    const hash = await bcrypt.hash(password, 10);

    const newUserData: Omit<User, "id"> = {
      email,
      password: hash,
      name: name ?? "",
      role: "USUARIO" as Role,
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return UserRepository.create(newUserData);
  },
};
