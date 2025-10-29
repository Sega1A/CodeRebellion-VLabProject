import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import HomePage from "@/app/vista_curso/page";

// Type for globalThis with test role
interface GlobalThisWithTestRole {
  __TEST_ROLE__?: string;
}

global.alert = jest.fn();
global.console.log = jest.fn();


jest.mock("@/app/vista_curso/styles.css", () => ({}));

describe("HomePage - Vista Curso (app/vista_curso/page.tsx)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  jest.spyOn(window, "alert").mockImplementation(() => {});

  test("renderiza título y descripción por defecto", () => {
    render(<HomePage />);
    expect(screen.getByText("Introducción a la programación")).toBeInTheDocument();
    expect(screen.getByText(/Lorem ipsum dolor sit amet/i)).toBeInTheDocument();
  });

  test("alternar tema cambia la clase del contenedor", () => {
    const { container } = render(<HomePage />);
    const themeButton = screen.getByLabelText("Toggle theme");
    const root = container.querySelector(".container");

    expect(root).toHaveClass("theme-dark");

    fireEvent.click(themeButton);
    expect(root).toHaveClass("theme-light");

    fireEvent.click(themeButton);
    expect(root).toHaveClass("theme-dark");
  });

  test("flujo de edición: mostrar Editar, editar y guardar (mock role)", () => {
    (globalThis as GlobalThisWithTestRole).__TEST_ROLE__ = "profesorEditor";
    try {
      render(<HomePage />);

      
      const editBtn = screen.getByText("Editar");
      expect(editBtn).toBeInTheDocument();

      
      fireEvent.click(editBtn);

      
      expect(screen.getByText("Guardar")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();

      
      const titleInput = screen.getByDisplayValue("Introducción a la programación");
      expect(titleInput).toBeInTheDocument();

      
      fireEvent.change(titleInput, { target: { value: "Nuevo Título" } });
      fireEvent.click(screen.getByText("Guardar"));

      
      expect(screen.getByText("Nuevo Título")).toBeInTheDocument();
      expect(window.alert).toHaveBeenCalled();
    } finally {
      delete (globalThis as GlobalThisWithTestRole).__TEST_ROLE__;
    }
  });

});