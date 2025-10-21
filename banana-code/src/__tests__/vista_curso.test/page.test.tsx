/**
 * Tests unitarios para HomePage Component
 * Ruta: app/vista_curso/page.tsx
 * Archivo de tests: vista_curso.controller.test.ts
 */

// @ts-nocheck

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
// helper removed; use direct global override for role in this test
import "@testing-library/jest-dom";
import HomePage from "@/app/vista_curso/page";

// Mock de alert y console
global.alert = jest.fn();
global.console.log = jest.fn();

// Mock de estilos CSS
jest.mock("@/app/vista_curso/styles.css", () => ({}));

describe("HomePage - Vista Curso (app/vista_curso/page.tsx)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // minimal setup per-suite
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
    (globalThis as any).__TEST_ROLE__ = "profesorEditor";
    try {
      render(<HomePage />);

      // Ahora el botón Editar debe existir
      const editBtn = screen.getByText("Editar");
      expect(editBtn).toBeInTheDocument();

      // Entrar en modo edición
      fireEvent.click(editBtn);

      // Deben aparecer los botones Guardar y Cancelar
      expect(screen.getByText("Guardar")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();

      // Inputs deben contener los valores por defecto
      const titleInput = screen.getByDisplayValue("Introducción a la programación");
      expect(titleInput).toBeInTheDocument();

      // Cambiar título y guardar
      fireEvent.change(titleInput, { target: { value: "Nuevo Título" } });
      fireEvent.click(screen.getByText("Guardar"));

      // El texto nuevo debe mostrarse y alert debe haberse llamado
      expect(screen.getByText("Nuevo Título")).toBeInTheDocument();
      expect(window.alert).toHaveBeenCalled();
    } finally {
      delete (globalThis as any).__TEST_ROLE__;
    }
  });

});