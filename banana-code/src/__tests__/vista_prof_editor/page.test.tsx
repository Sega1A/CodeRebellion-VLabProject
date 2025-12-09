import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseEditor from '@/app/vista_prof_editor/page';  

 
beforeAll(() => {
   
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,  
  });

   
  global.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 0) as unknown as number;
  };

  global.cancelAnimationFrame = (id) => {
    clearTimeout(id);
  };

   
  window.addEventListener = jest.fn();
  window.removeEventListener = jest.fn();
});

 
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

 

describe('CourseEditor Component', () => {

  const initialTitle = 'Introducción a la programación';
  const initialDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl ligula, pulvinar accumsan varius et, volutpat eget ipsum. Sed at libero vel turpis blandit sollicitudin vitae nec lectus.';

  test('1. should render initial course data in view mode', () => {
    render(<CourseEditor />);

    
    expect(screen.getByRole('heading', { name: initialTitle })).toBeInTheDocument();

     
    expect(screen.getByText(initialDescription)).toBeInTheDocument();

     
    expect(screen.getByRole('button', { name: /Editar campo/i })).toBeInTheDocument();

    
    expect(screen.queryByRole('button', { name: /Guardar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Cancelar/i })).not.toBeInTheDocument();
  });

  test('2. should switch to edit mode when "Editar" button is clicked', () => {
    render(<CourseEditor />);

    
    const editButton = screen.getByRole('button', { name: /Editar campo/i });
    fireEvent.click(editButton);

     
    const titleInput = screen.getByDisplayValue(initialTitle);
    const descriptionInput = screen.getByDisplayValue(initialDescription);

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(titleInput).toHaveValue(initialTitle);
    expect(descriptionInput).toHaveValue(initialDescription);

     
    expect(screen.getByRole('button', { name: /Guardar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();

     
    expect(screen.queryByRole('button', { name: /Editar campo/i })).not.toBeInTheDocument();
  });

  test('3. should update course data when edited and saved', () => {
    render(<CourseEditor />);

     
    fireEvent.click(screen.getByRole('button', { name: /Editar campo/i }));

     
    const newTitle = 'Nuevo Título de Prueba';
    const newDescription = 'Esta es una nueva descripción.';
    
    const titleInput = screen.getByDisplayValue(initialTitle);
    const descriptionInput = screen.getByDisplayValue(initialDescription);

    fireEvent.change(titleInput, { target: { value: newTitle } });
    fireEvent.change(descriptionInput, { target: { value: newDescription } });

    
    const saveButton = screen.getByRole('button', { name: /Guardar/i });
    fireEvent.click(saveButton);

     
    expect(screen.getByRole('button', { name: /Editar campo/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Guardar/i })).not.toBeInTheDocument();

     
    expect(screen.getByRole('heading', { name: newTitle })).toBeInTheDocument();
    expect(screen.getByText(newDescription)).toBeInTheDocument();

     
    expect(screen.queryByRole('heading', { name: initialTitle })).not.toBeInTheDocument();
    expect(screen.queryByText(initialDescription)).not.toBeInTheDocument();
  });

  test('4. should revert changes when "Cancelar" button is clicked', () => {
    render(<CourseEditor />);

    
    fireEvent.click(screen.getByRole('button', { name: /Editar campo/i }));

     
    const titleInput = screen.getByDisplayValue(initialTitle);
    const descriptionInput = screen.getByDisplayValue(initialDescription);

    fireEvent.change(titleInput, { target: { value: 'Cambio Temporal' } });
    fireEvent.change(descriptionInput, { target: { value: 'Descripción temporal' } });

     
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);

     
    expect(screen.getByRole('button', { name: /Editar campo/i })).toBeInTheDocument();

     
    expect(screen.getByRole('heading', { name: initialTitle })).toBeInTheDocument();
    expect(screen.getByText(initialDescription)).toBeInTheDocument();

     
    expect(screen.queryByRole('heading', { name: /Cambio Temporal/i })).not.toBeInTheDocument();
  });

  test('5. should add and clean up event listeners on mount/unmount', () => {
     
    const { unmount } = render(<CourseEditor />);
    
     
    expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    expect(window.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(window.addEventListener).toHaveBeenCalledTimes(2); // Uno por scroll, uno por mousemove

     
    unmount();

     
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledTimes(2);
  });

});