import { UserService } from "@/services/user.service";
import { UserRepository } from "@/repositories/user.repository";

type Role =
  | "ADMINISTRADOR"
  | "ESTUDIANTE"
  | "PROFESOR_EJECUTOR"
  | "PROFESOR_EDITOR";

interface UserMock {
  id: string;
  name: string | null;
  email: string | null;
  password: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  phone: string | null;
  studentCode: string | null;
}

jest.mock("@/repositories/user.repository");

describe("UserService", () => {
  const mockFindById = jest.mocked(UserRepository.findById);
  const mockChangeRole = jest.mocked(UserRepository.changeRole);
  const mockGetUsers = jest.mocked(
    UserRepository.getUsers
  ) as jest.MockedFunction<
    () => Promise<{ id: string; email: string; role: Role }[]>
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listUsers debe retornar la lista de usuarios", async () => {
    const users: { id: string; email: string; role: Role }[] = [
      { id: "1", email: "a@b.com", role: "ESTUDIANTE" },
      { id: "2", email: "b@b.com", role: "PROFESOR_EJECUTOR" },
    ];
    mockGetUsers.mockResolvedValueOnce(users);

    const result = await UserService.listUsers();

    expect(result).toEqual(users);
    expect(mockGetUsers).toHaveBeenCalledTimes(1);
  });

  test("changeUserRole lanza error si el rol es ADMINISTRADOR", async () => {
    await expect(
      UserService.changeUserRole("1", "ADMINISTRADOR")
    ).rejects.toThrow("No se puede asignar el rol de administrador");
  });

  test("changeUserRole lanza error si el usuario no existe", async () => {
    mockFindById.mockResolvedValueOnce(null);

    await expect(UserService.changeUserRole("1", "ESTUDIANTE")).rejects.toThrow(
      "Usuario no encontrado"
    );
  });

  test("changeUserRole lanza error si el usuario es ADMINISTRADOR", async () => {
    mockFindById.mockResolvedValueOnce({
      id: "1",
      name: null,
      email: "admin@test.com",
      password: null,
      emailVerified: null,
      image: null,
      role: "ADMINISTRADOR",
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: null,
      studentCode: null,
    } as UserMock);

    await expect(
      UserService.changeUserRole("1", "PROFESOR_EJECUTOR")
    ).rejects.toThrow("No se puede cambiar el rol de un administrador");
  });

  test("changeUserRole cambia el rol correctamente", async () => {
    const user: UserMock = {
      id: "2",
      name: null,
      email: "user@test.com",
      password: null,
      emailVerified: null,
      image: null,
      role: "ESTUDIANTE",
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: null,
      studentCode: null,
    };
    const updatedUser: UserMock = { ...user, role: "PROFESOR_EJECUTOR" };

    mockFindById.mockResolvedValueOnce(user);
    mockChangeRole.mockResolvedValueOnce(updatedUser);

    const result = await UserService.changeUserRole("2", "PROFESOR_EJECUTOR");

    expect(result).toEqual(updatedUser);
    expect(mockChangeRole).toHaveBeenCalledWith("2", "PROFESOR_EJECUTOR");
  });
});
