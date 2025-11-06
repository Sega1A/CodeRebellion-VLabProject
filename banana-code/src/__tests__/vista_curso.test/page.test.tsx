import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
jest.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
      prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
      get: () => null,
    }),
  };
});

import HomePage from "@/app/vista_curso/page";

type Role = "estudiante" | "profesorEditor" | "admin";
interface GlobalThisWithTestRole {
  __TEST_ROLE__?: Role;
}

const setTestRole = (role: Role) => {
  (globalThis as GlobalThisWithTestRole).__TEST_ROLE__ = role;
};

const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

jest
  .spyOn(window, "requestAnimationFrame")
  .mockImplementation((callback: FrameRequestCallback): number => {
    callback(0);
    return 1;
  });

jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

const addEventListenerMock = jest.spyOn(window, "addEventListener");
const removeEventListenerMock = jest.spyOn(window, "removeEventListener");

beforeEach(() => {
  jest.clearAllMocks();
  delete (globalThis as GlobalThisWithTestRole).__TEST_ROLE__;
});

describe("HomePage Component (vista_curso)", () => {
  const defaultDesc =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl ligula, pulvinar accumsan varius et, volutpat eget ipsum. Sed at libero vel turpis blandit sollicitudin vitae nec lectus.";

  it("1. Renderiza como 'estudiante' (vista de tópicos)", () => {
    setTestRole("estudiante");
    render(<HomePage />);

    // La vista por defecto muestra el tópico seleccionado
    expect(
      screen.getByRole("heading", { name: /Variables y tipos de datos/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Declaración de variables/i)).toBeInTheDocument();

    // Sin controles de edición
    expect(screen.queryByRole("button", { name: /Editar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Guardar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cancelar/i })).not.toBeInTheDocument();
  });

  it("2. Renderiza como 'profesorEditor' (vista de tópicos sin edición)", () => {
    setTestRole("profesorEditor");
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /Variables y tipos de datos/i })
    ).toBeInTheDocument();

    // Sin controles de edición en esta vista
    expect(screen.queryByRole("button", { name: /Editar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Guardar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cancelar/i })).not.toBeInTheDocument();
  });

  it("3. Renderiza como 'admin' (vista de tópicos sin edición)", () => {
    setTestRole("admin");
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /Variables y tipos de datos/i })
    ).toBeInTheDocument();

    // Sin controles de edición en esta vista
    expect(screen.queryByRole("button", { name: /Editar/i })).not.toBeInTheDocument();
  });

  it("4. No dispara alertas de guardado en la vista de tópicos", async () => {
    setTestRole("profesorEditor");
    render(<HomePage />);

    await waitFor(() => {
      expect(alertMock).not.toHaveBeenCalled();
    });
  });

  it("5. Añade y elimina event listeners de 'scroll' y 'mousemove'", () => {
    const { unmount } = render(<HomePage />);

    expect(addEventListenerMock).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true }
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );
  });
});