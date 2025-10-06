import { UserRepository } from "@/repositories/user.repository";
import bcrypt from "bcrypt";

export const AuthService = {
  async register(email: string, password: string, name?: string) {
    const existingUser = await UserRepository.findByEmail(email);
    if (!existingUser) {
      throw new Error("El usuario ya existe");
    }
    const hash = await bcrypt.hash(password, 10);
    return UserRepository.create({
      email,
      password: hash,
      name,
      provider: "credentials",
    } as any);
  },
};
