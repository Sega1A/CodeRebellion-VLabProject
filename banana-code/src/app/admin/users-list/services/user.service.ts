import { UserResponse } from "../types/userResponse.type";

export async function getUsers() {
  try {
    const response = await fetch("/api/users");
    const users: UserResponse[] = await response.json();
    if (!users) throw new Error("Usuarios no encontrados");
    return users;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(String(error));
  }
}
