import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseEditor from '@/app/vista_prof_editor/page'; // Asegúrate que la ruta sea correcta

// --- Mocks Globales ---
// Mockeamos propiedades de 'window' que se usan en el useEffect y cálculos
beforeAll(() => {
  // Mock de 'innerWidth' para los cálculos del mouse
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024, // Un valor estándar para evitar división por cero
  });

  // Mock de requestAnimationFrame para que no falle en JSDOM
  global.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 0) as unknown as number;
  };

  global.cancelAnimationFrame = (id) => {
    clearTimeout(id);
  };

  // Mock de addEventListener/removeEventListener para espiarlos
  window.addEventListener = jest.fn();
  window.removeEventListener = jest.fn();
});

// Limpiamos los mocks después de cada test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// --- Suite de Pruebas ---

describe('CourseEditor Component', () => {

  const initialTitle = 'Introducción a la programación';
  const initialDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl ligula, pulvinar accumsan varius et, volutpat eget ipsum. Sed at libero vel turpis blandit sollicitudin vitae nec lectus.';

  test('1. should render initial course data in view mode', () => {
    render(<CourseEditor />);

    // Verifica que el título inicial está presente
    expect(screen.getByRole('heading', { name: initialTitle })).toBeInTheDocument();

    // Verifica que la descripción inicial está presente
    expect(screen.getByText(initialDescription)).toBeInTheDocument();

    // Verifica que el botón "Editar" está presente
    expect(screen.getByRole('button', { name: /Editar campo/i })).toBeInTheDocument();

    // Verifica que los botones de "Guardar" y "Cancelar" no están
    expect(screen.queryByRole('button', { name: /Guardar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Cancelar/i })).not.toBeInTheDocument();
  });

  test('2. should switch to edit mode when "Editar" button is clicked', () => {
    render(<CourseEditor />);

    // 1. Clic en "Editar"
    const editButton = screen.getByRole('button', { name: /Editar campo/i });
    fireEvent.click(editButton);

    // 2. Verifica que los inputs aparecen con los valores correctos
    // Usamos getByDisplayValue para encontrar los inputs por su contenido
    const titleInput = screen.getByDisplayValue(initialTitle);
    const descriptionInput = screen.getByDisplayValue(initialDescription);

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(titleInput).toHaveValue(initialTitle);
    expect(descriptionInput).toHaveValue(initialDescription);

    // 3. Verifica que los botones de "Guardar" y "Cancelar" están presentes
    expect(screen.getByRole('button', { name: /Guardar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();

    // 4. Verifica que el botón "Editar" desapareció
    expect(screen.queryByRole('button', { name: /Editar campo/i })).not.toBeInTheDocument();
  });

  test('3. should update course data when edited and saved', () => {
    render(<CourseEditor />);

    // 1. Entrar en modo edición
    fireEvent.click(screen.getByRole('button', { name: /Editar campo/i }));

    // 2. Definir nuevos valores y cambiar los inputs
    const newTitle = 'Nuevo Título de Prueba';
    const newDescription = 'Esta es una nueva descripción.';
    
    const titleInput = screen.getByDisplayValue(initialTitle);
    const descriptionInput = screen.getByDisplayValue(initialDescription);

    fireEvent.change(titleInput, { target: { value: newTitle } });
    fireEvent.change(descriptionInput, { target: { value: newDescription } });

    // 3. Guardar cambios
    const saveButton = screen.getByRole('button', { name: /Guardar/i });
    fireEvent.click(saveButton);

    // 4. Verificar que volvemos a modo vista
    expect(screen.getByRole('button', { name: /Editar campo/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Guardar/i })).not.toBeInTheDocument();

    // 5. Verificar que los nuevos datos se muestran en la UI
    expect(screen.getByRole('heading', { name: newTitle })).toBeInTheDocument();
    expect(screen.getByText(newDescription)).toBeInTheDocument();

    // 6. Verificar que los datos antiguos ya no están
    expect(screen.queryByRole('heading', { name: initialTitle })).not.toBeInTheDocument();
    expect(screen.queryByText(initialDescription)).not.toBeInTheDocument();
  });

  test('4. should revert changes when "Cancelar" button is clicked', () => {
    render(<CourseEditor />);

    // 1. Entrar en modo edición
    fireEvent.click(screen.getByRole('button', { name: /Editar campo/i }));

    // 2. Cambiar los inputs a valores temporales
    const titleInput = screen.getByDisplayValue(initialTitle);
    const descriptionInput = screen.getByDisplayValue(initialDescription);

    fireEvent.change(titleInput, { target: { value: 'Cambio Temporal' } });
    fireEvent.change(descriptionInput, { target: { value: 'Descripción temporal' } });

    // 3. Clic en "Cancelar"
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    // 4. Verificar que volvemos a modo vista
    expect(screen.getByRole('button', { name: /Editar campo/i })).toBeInTheDocument();

    // 5. Verificar que los datos *originales* siguen presentes
    expect(screen.getByRole('heading', { name: initialTitle })).toBeInTheDocument();
    expect(screen.getByText(initialDescription)).toBeInTheDocument();

    // 6. Verificar que los cambios temporales no se aplicaron
    expect(screen.queryByRole('heading', { name: /Cambio Temporal/i })).not.toBeInTheDocument();
  });

  test('5. should add and clean up event listeners on mount/unmount', () => {
    // 1. Renderizar el componente
    const { unmount } = render(<CourseEditor />);
    
    // 2. Verificar que los listeners se añadieron al montar
    // El mock de addEventListener es de jest.fn()
    expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    expect(window.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(window.addEventListener).toHaveBeenCalledTimes(2); // Uno por scroll, uno por mousemove

    // 3. Desmontar el componente
    unmount();

    // 4. Verificar que los listeners se limpiaron
    // El mock de removeEventListener es de jest.fn()
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledTimes(2);
  });

});