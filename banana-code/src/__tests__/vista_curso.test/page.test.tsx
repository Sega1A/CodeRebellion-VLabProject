import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; 
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

jest
  .spyOn(window, "cancelAnimationFrame")
  .mockImplementation(() => {});


const addEventListenerMock = jest.spyOn(window, "addEventListener");
const removeEventListenerMock = jest.spyOn(window, "removeEventListener");


beforeEach(() => {
  jest.clearAllMocks();
  
  delete (globalThis as GlobalThisWithTestRole).__TEST_ROLE__;
});



describe("HomePage Component", () => {
  const defaultTitle = "Introducción a la programación";
  const defaultDesc =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl ligula, pulvinar accumsan varius et, volutpat eget ipsum. Sed at libero vel turpis blandit sollicitudin vitae nec lectus.";

  it("1. Renderiza como 'estudiante' (solo lectura)", () => {
    setTestRole("estudiante");
    render(<HomePage />);

    
    expect(screen.getByRole("heading", { name: defaultTitle })).toBeInTheDocument();
    expect(screen.getByText(defaultDesc)).toBeInTheDocument();

    
    expect(screen.queryByRole("button", { name: /Editar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Guardar/i })).not.toBeInTheDocument();
  });

  it("2. Renderiza como 'profesorEditor' (modo vista)", () => {
    setTestRole("profesorEditor");
    render(<HomePage />);

    
    expect(screen.getByRole("heading", { name: defaultTitle })).toBeInTheDocument();

    
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();

    
    expect(screen.queryByRole("button", { name: /Guardar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cancelar/i })).not.toBeInTheDocument();
  });

  it("3. Renderiza como 'admin' (modo vista)", () => {
    setTestRole("admin");
    render(<HomePage />);

    
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();
  });

  it("4. Permite el flujo completo de Edición y Guardado", async () => {
    setTestRole("profesorEditor");
    render(<HomePage />);

    
    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));

    
    expect(screen.queryByRole("button", { name: /Editar/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Guardar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();

    
    const titleInput = screen.getByDisplayValue(defaultTitle);
    const descTextarea = screen.getByDisplayValue(defaultDesc);

    
    const newTitle = "Nuevo Título del Curso";
    const newDesc = "Esta es la nueva descripción.";
    fireEvent.change(titleInput, { target: { value: newTitle } });
    fireEvent.change(descTextarea, { target: { value: newDesc } });

    
    fireEvent.click(screen.getByRole("button", { name: /Guardar/i }));

    
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /Guardar/i })).not.toBeInTheDocument();
    });
    
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();

    
    expect(screen.getByRole("heading", { name: newTitle })).toBeInTheDocument();
    expect(screen.getByText(newDesc)).toBeInTheDocument();

    
    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith("Guardado exitoso: " + newTitle);
  });

  it("5. Permite cancelar la edición", () => {
    setTestRole("profesorEditor");
    render(<HomePage />);

    
    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));

    
    const titleInput = screen.getByDisplayValue(defaultTitle);
    const descTextarea = screen.getByDisplayValue(defaultDesc);
    fireEvent.change(titleInput, { target: { value: "Título Temporal" } });
    fireEvent.change(descTextarea, { target: { value: "Descripción Temporal" } });

    
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    
    expect(screen.queryByRole("button", { name: /Guardar/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();

    
    expect(screen.getByRole("heading", { name: defaultTitle })).toBeInTheDocument();
    expect(screen.getByText(defaultDesc)).toBeInTheDocument();

    
    expect(screen.queryByText("Título Temporal")).not.toBeInTheDocument();
  });

  it("6. Añade y elimina event listeners de 'scroll' y 'mousemove' al montar/desmontar", () => {
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