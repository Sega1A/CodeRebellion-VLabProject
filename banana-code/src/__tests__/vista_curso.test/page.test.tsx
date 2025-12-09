import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const MOCK_COURSE_DATA = [
  {
    id: "course-123",
    name: "Curso de Prueba",
    content: {
      topics: [
        {
          id: 1,
          title: "Introducción a JavaScript",
          content: "Contenido del tópico 1. Variables y tipos de datos.",
          subtopics: [
            {
              id: 101,
              title: "Declaración de variables",
              content: "let, const, var",
            },
          ],
        },
        {
          id: 2,
          title: "Funciones y Scopes",
          content: "Contenido del tópico 2.",
        },
      ],
    },
  },
];

global.fetch = jest.fn((url) => {
  if (url === "/api/courses/status?status=ACTIVO") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(MOCK_COURSE_DATA),
    });
  }
  return Promise.reject(new Error("Unknown URL"));
}) as jest.Mock;

jest.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
      prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
      get: (param: string) => {
        if (param === "view" || param === "topic") return null;
        return null;
      },
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
  it("1. Renderiza como 'estudiante' (vista de tópicos)", async () => {
    setTestRole("estudiante");
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.queryByText(/Cargando.../i)).not.toBeInTheDocument();
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByRole("heading", { name: /Introducción a JavaScript/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Declaración de variables/i)).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /Editar/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Guardar/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Cancelar/i })
    ).not.toBeInTheDocument();
  });

  it("2. Renderiza como 'profesorEditor' (vista de tópicos sin edición)", async () => {
    setTestRole("profesorEditor");
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.queryByText(/Cargando.../i)).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: /Introducción a JavaScript/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /Editar/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Guardar/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Cancelar/i })
    ).not.toBeInTheDocument();
  });

  it("3. Renderiza como 'admin' (vista de tópicos sin edición)", async () => {
    setTestRole("admin");
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.queryByText(/Cargando.../i)).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: /Introducción a JavaScript/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /Editar/i })
    ).not.toBeInTheDocument();
  });

  it("4. No dispara alertas de guardado en la vista de tópicos", async () => {
    setTestRole("profesorEditor");
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.queryByText(/Cargando.../i)).not.toBeInTheDocument();
    });

    expect(alertMock).not.toHaveBeenCalled();
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
