import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // Para tener matchers como .toBeInTheDocument()
import HomePage from "@/app/vista_curso/page"; // Asegúrate que la ruta sea correcta

// --- Configuración de Mocks ---

// Definimos el tipo para la variable global que usa el componente
type Role = "estudiante" | "profesorEditor" | "admin";
interface GlobalThisWithTestRole {
  __TEST_ROLE__?: Role;
}

// Función helper para establecer el rol antes de cada test
const setTestRole = (role: Role) => {
  (globalThis as GlobalThisWithTestRole).__TEST_ROLE__ = role;
};

// Mock de window.alert, ya que no existe en JSDOM (el entorno de Jest)
const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

// Mock de requestAnimationFrame y cancelAnimationFrame para evitar errores en JSDOM
// La implementación simple llama al callback inmediatamente.
jest
  .spyOn(window, "requestAnimationFrame")
  .mockImplementation((callback: FrameRequestCallback): number => {
    callback(0);
    return 1; // Devuelve un ID de frame simulado
  });

jest
  .spyOn(window, "cancelAnimationFrame")
  .mockImplementation(() => {});

// Mock de addEventListener/removeEventListener para verificar que se llamen
const addEventListenerMock = jest.spyOn(window, "addEventListener");
const removeEventListenerMock = jest.spyOn(window, "removeEventListener");

// Limpiamos los mocks después de cada test
beforeEach(() => {
  jest.clearAllMocks();
  // Reseteamos el rol global
  delete (globalThis as GlobalThisWithTestRole).__TEST_ROLE__;
});

// --- Tests ---

describe("HomePage Component", () => {
  const defaultTitle = "Introducción a la programación";
  const defaultDesc =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl ligula, pulvinar accumsan varius et, volutpat eget ipsum. Sed at libero vel turpis blandit sollicitudin vitae nec lectus.";

  it("1. Renderiza como 'estudiante' (solo lectura)", () => {
    setTestRole("estudiante");
    render(<HomePage />);

    // El contenido por defecto debe estar visible
    expect(screen.getByRole("heading", { name: defaultTitle })).toBeInTheDocument();
    expect(screen.getByText(defaultDesc)).toBeInTheDocument();

    // Los botones de edición NO deben existir
    expect(screen.queryByRole("button", { name: /Editar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Guardar/i })).not.toBeInTheDocument();
  });

  it("2. Renderiza como 'profesorEditor' (modo vista)", () => {
    setTestRole("profesorEditor");
    render(<HomePage />);

    // El contenido por defecto debe estar visible
    expect(screen.getByRole("heading", { name: defaultTitle })).toBeInTheDocument();

    // El botón de Editar DEBE existir
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();

    // Los botones de Guardar/Cancelar NO deben existir
    expect(screen.queryByRole("button", { name: /Guardar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cancelar/i })).not.toBeInTheDocument();
  });

  it("3. Renderiza como 'admin' (modo vista)", () => {
    setTestRole("admin");
    render(<HomePage />);

    // El botón de Editar DEBE existir (igual que profesorEditor)
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();
  });

  it("4. Permite el flujo completo de Edición y Guardado", async () => {
    setTestRole("profesorEditor");
    render(<HomePage />);

    // 1. Clic en "Editar"
    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));

    // 2. Verificar que estamos en modo edición
    expect(screen.queryByRole("button", { name: /Editar/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Guardar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();

    // 3. Encontrar los inputs (el <input> y <textarea>)
    const titleInput = screen.getByDisplayValue(defaultTitle);
    const descTextarea = screen.getByDisplayValue(defaultDesc);

    // 4. Cambiar el texto
    const newTitle = "Nuevo Título del Curso";
    const newDesc = "Esta es la nueva descripción.";
    fireEvent.change(titleInput, { target: { value: newTitle } });
    fireEvent.change(descTextarea, { target: { value: newDesc } });

    // 5. Clic en "Guardar"
    fireEvent.click(screen.getByRole("button", { name: /Guardar/i }));

    // 6. Verificar que volvemos a modo vista
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /Guardar/i })).not.toBeInTheDocument();
    });
    
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();

    // 7. Verificar que el contenido se actualizó
    expect(screen.getByRole("heading", { name: newTitle })).toBeInTheDocument();
    expect(screen.getByText(newDesc)).toBeInTheDocument();

    // 8. Verificar que la alerta (mock) fue llamada
    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith("Guardado exitoso: " + newTitle);
  });

  it("5. Permite cancelar la edición", () => {
    setTestRole("profesorEditor");
    render(<HomePage />);

    // 1. Clic en "Editar"
    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));

    // 2. Encontrar y cambiar el texto
    const titleInput = screen.getByDisplayValue(defaultTitle);
    const descTextarea = screen.getByDisplayValue(defaultDesc);
    fireEvent.change(titleInput, { target: { value: "Título Temporal" } });
    fireEvent.change(descTextarea, { target: { value: "Descripción Temporal" } });

    // 3. Clic en "Cancelar"
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    // 4. Verificar que volvemos a modo vista
    expect(screen.queryByRole("button", { name: /Guardar/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();

    // 5. Verificar que el contenido es el ORIGINAL, no el temporal
    expect(screen.getByRole("heading", { name: defaultTitle })).toBeInTheDocument();
    expect(screen.getByText(defaultDesc)).toBeInTheDocument();

    // 6. Verificar que el texto temporal no está en pantalla
    expect(screen.queryByText("Título Temporal")).not.toBeInTheDocument();
  });

  it("6. Añade y elimina event listeners de 'scroll' y 'mousemove' al montar/desmontar", () => {
    const { unmount } = render(<HomePage />);

    // Verificar que los listeners se añadieron al montar
    expect(addEventListenerMock).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true }
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );

    // Desmontar el componente
    unmount();

    // Verificar que los listeners se eliminaron al desmontar
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );

    // Verificar que cancelAnimationFrame fue llamado en el cleanup si había un rafId pendiente
    // Nota: Este test puede no detectar el cancelAnimationFrame si no hubo ningún scroll/mousemove
    // durante el renderizado. Pero verifica que los listeners se agregaron y eliminaron correctamente.
  });
});