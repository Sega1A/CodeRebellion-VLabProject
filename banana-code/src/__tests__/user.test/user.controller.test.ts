import { UserController } from "@/controllers/user.controller";
import { UserService } from "@/services/user.service";
import { NextResponse } from "next/server";

type Role =
  | "ADMINISTRADOR"
  | "ESTUDIANTE"
  | "PROFESOR_EJECUTOR"
  | "PROFESOR_EDITOR";

jest.mock("@/services/user.service");

const jsonMock = jest.fn((data: unknown, init?: { status?: number }) => ({
  json: data,
  status: init?.status ?? 200,
}));

(NextResponse as unknown as { json: typeof jsonMock }).json = jsonMock;

describe("UserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listUsers retorna la lista de usuarios correctamente", async () => {
    const users = [{ id: "1", email: "a@b.com", role: "ESTUDIANTE" as Role }];
    (UserService.listUsers as jest.Mock).mockResolvedValueOnce(users);

    const res = await UserController.listUsers();

    expect(UserService.listUsers).toHaveBeenCalledTimes(1);
    expect(res.json).toEqual(users);
    expect(res.status).toBe(200);
  });

  test("listUsers maneja errores y devuelve status 500", async () => {
    (UserService.listUsers as jest.Mock).mockRejectedValueOnce(
      new Error("Fallo interno")
    );

    const res = await UserController.listUsers();

    expect((res.json as { error?: string }).error).toBe("Fallo interno");
    expect(res.status).toBe(500);
  });

  test("changeUserRole retorna 400 si faltan datos", async () => {
    const req = {
      json: async () => ({ id: "", role: "" as Role }),
    } as unknown as Request;

    const res = await UserController.changeUserRole(req);

    expect((res.json as { error?: string }).error).toBe("Faltan datos");
    expect(res.status).toBe(400);
  });

  test("changeUserRole retorna el usuario actualizado correctamente", async () => {
    const updatedUser = {
      id: "1",
      email: "a@b.com",
      role: "PROFESOR_EJECUTOR" as Role,
    };
    (UserService.changeUserRole as jest.Mock).mockResolvedValueOnce(
      updatedUser
    );

    const req = {
      json: async () => ({ id: "1", role: "PROFESOR_EJECUTOR" as Role }),
    } as unknown as Request;

    const res = await UserController.changeUserRole(req);

    expect(UserService.changeUserRole).toHaveBeenCalledWith(
      "1",
      "PROFESOR_EJECUTOR"
    );
    expect(res.json).toEqual(updatedUser);
    expect(res.status).toBe(200);
  });

  test("changeUserRole maneja errores y devuelve status 500", async () => {
    (UserService.changeUserRole as jest.Mock).mockRejectedValueOnce(
      new Error("Error al cambiar rol")
    );

    const req = {
      json: async () => ({ id: "1", role: "ESTUDIANTE" as Role }),
    } as unknown as Request;

    const res = await UserController.changeUserRole(req);

    expect((res.json as { error?: string }).error).toBe("Error al cambiar rol");
    expect(res.status).toBe(500);
  });
});
