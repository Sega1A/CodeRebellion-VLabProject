import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditorCurso from '@/app/components/navbar/EditorCurso';

// Mock de lucide-react icons
jest.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon">Plus Icon</div>,
  ArrowLeft: () => <div data-testid="arrow-left-icon">Arrow Left Icon</div>,
  Save: () => <div data-testid="save-icon">Save Icon</div>,
  Check: () => <div data-testid="check-icon">Check Icon</div>,
  Menu: () => <div data-testid="menu-icon">Menu Icon</div>,
}));

describe('EditorCurso Component', () => {
  describe('Modo Lista (no editing)', () => {
    it('debería renderizar el título "Editor de Cursos" cuando no está en modo edición', () => {
      render(<EditorCurso />);
      
      expect(screen.getByText('Editor de Cursos')).toBeInTheDocument();
      expect(screen.getByText('Gestión Docente')).toBeInTheDocument();
    });

    it('debería mostrar el emoji del plátano', () => {
      render(<EditorCurso />);
      
      expect(screen.getByText('🍌')).toBeInTheDocument();
    });

    it('debería mostrar el botón "Crear Curso" cuando se proporciona onCreateCourse', () => {
      const mockCreateCourse = jest.fn();
      render(<EditorCurso onCreateCourse={mockCreateCourse} />);
      
      expect(screen.getByText('Crear Curso')).toBeInTheDocument();
    });

    it('debería llamar a onCreateCourse cuando se hace click en el botón', () => {
      const mockCreateCourse = jest.fn();
      render(<EditorCurso onCreateCourse={mockCreateCourse} />);
      
      const button = screen.getByText('Crear Curso');
      fireEvent.click(button);
      
      expect(mockCreateCourse).toHaveBeenCalledTimes(1);
    });

    it('NO debería mostrar el botón "Crear Curso" cuando no se proporciona onCreateCourse', () => {
      render(<EditorCurso />);
      
      expect(screen.queryByText('Crear Curso')).not.toBeInTheDocument();
    });

    it('debería tener la clase theme-light por defecto', () => {
      const { container } = render(<EditorCurso />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('theme-light');
    });
  });

  describe('Modo Edición (isEditing=true)', () => {
    it('debería mostrar el input del título del curso en modo edición', () => {
      render(
        <EditorCurso 
          isEditing={true}
          courseTitle="Mi Curso de Prueba"
        />
      );
      
      const input = screen.getByPlaceholderText('Título del curso') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toBe('Mi Curso de Prueba');
    });

    it('debería llamar a onTitleChange cuando se edita el título', () => {
      const mockTitleChange = jest.fn();
      render(
        <EditorCurso 
          isEditing={true}
          courseTitle="Curso Original"
          onTitleChange={mockTitleChange}
        />
      );
      
      const input = screen.getByPlaceholderText('Título del curso');
      fireEvent.change(input, { target: { value: 'Curso Modificado' } });
      
      expect(mockTitleChange).toHaveBeenCalledWith('Curso Modificado');
    });

    it('debería mostrar el botón de volver (ArrowLeft)', () => {
      render(<EditorCurso isEditing={true} />);
      
      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
    });

    it('debería llamar a onBack cuando se hace click en el botón de volver', () => {
      const mockBack = jest.fn();
      render(
        <EditorCurso 
          isEditing={true}
          onBack={mockBack}
        />
      );
      
      const backButton = screen.getByTestId('arrow-left-icon').closest('button');
      if (backButton) fireEvent.click(backButton);
      
      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it('debería mostrar el botón de menú móvil', () => {
      render(<EditorCurso isEditing={true} />);
      
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('debería llamar a onToggleSidebar cuando se hace click en el botón de menú', () => {
      const mockToggleSidebar = jest.fn();
      render(
        <EditorCurso 
          isEditing={true}
          onToggleSidebar={mockToggleSidebar}
        />
      );
      
      const menuButton = screen.getByTestId('menu-icon').closest('button');
      if (menuButton) fireEvent.click(menuButton);
      
      expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
    });

    it('debería mostrar el botón "Guardar" por defecto', () => {
      render(<EditorCurso isEditing={true} />);
      
      expect(screen.getByText('Guardar')).toBeInTheDocument();
      expect(screen.getByTestId('save-icon')).toBeInTheDocument();
    });

    it('debería llamar a onSave cuando se hace click en el botón Guardar', () => {
      const mockSave = jest.fn();
      render(
        <EditorCurso 
          isEditing={true}
          onSave={mockSave}
        />
      );
      
      const saveButton = screen.getByText('Guardar');
      fireEvent.click(saveButton);
      
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('Estados de Guardado', () => {
    it('debería mostrar "Guardando" con spinner cuando saveStatus="saving"', () => {
      render(
        <EditorCurso 
          isEditing={true}
          saveStatus="saving"
        />
      );
      
      expect(screen.getByText('Guardando')).toBeInTheDocument();
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('debería deshabilitar el botón cuando saveStatus="saving"', () => {
      render(
        <EditorCurso 
          isEditing={true}
          saveStatus="saving"
        />
      );
      
      const saveButton = screen.getByText('Guardando').closest('button');
      expect(saveButton).toBeDisabled();
    });

    it('debería mostrar "Guardado" con check cuando saveStatus="saved"', () => {
      render(
        <EditorCurso 
          isEditing={true}
          saveStatus="saved"
        />
      );
      
      expect(screen.getByText('Guardado')).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    it('debería aplicar la clase bg-green-600 cuando saveStatus="saved"', () => {
      render(
        <EditorCurso 
          isEditing={true}
          saveStatus="saved"
        />
      );
      
      const saveButton = screen.getByText('Guardado').closest('button');
      expect(saveButton).toHaveClass('bg-green-600');
    });

    it('debería aplicar la clase bg-gray-400 cuando saveStatus="saving"', () => {
      render(
        <EditorCurso 
          isEditing={true}
          saveStatus="saving"
        />
      );
      
      const saveButton = screen.getByText('Guardando').closest('button');
      expect(saveButton).toHaveClass('bg-gray-400');
    });

    it('debería aplicar clases de gradiente cuando no hay saveStatus', () => {
      render(
        <EditorCurso 
          isEditing={true}
          saveStatus=""
        />
      );
      
      const saveButton = screen.getByText('Guardar').closest('button');
      expect(saveButton).toHaveClass('bg-gradient-to-r');
      expect(saveButton).toHaveClass('from-orange-500');
      expect(saveButton).toHaveClass('to-amber-500');
    });
  });

  describe('Clases CSS y Estilos', () => {
    it('debería tener la clase navbar sticky', () => {
      const { container } = render(<EditorCurso />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('navbar');
      expect(header).toHaveClass('sticky');
    });

    it('debería tener left-nav y right-nav', () => {
      const { container } = render(<EditorCurso />);
      
      expect(container.querySelector('.left-nav')).toBeInTheDocument();
      expect(container.querySelector('.right-nav')).toBeInTheDocument();
    });

    it('debería tener brand-wrapper y brand-emoji', () => {
      const { container } = render(<EditorCurso />);
      
      expect(container.querySelector('.brand-wrapper')).toBeInTheDocument();
      expect(container.querySelector('.brand-emoji')).toBeInTheDocument();
    });
  });

  describe('Integración - Flujo completo de edición', () => {
    it('debería permitir editar el título y guardar', () => {
      const mockTitleChange = jest.fn();
      const mockSave = jest.fn();
      
      render(
        <EditorCurso 
          isEditing={true}
          courseTitle="Curso Original"
          onTitleChange={mockTitleChange}
          onSave={mockSave}
        />
      );
      
      // Editar título
      const input = screen.getByPlaceholderText('Título del curso');
      fireEvent.change(input, { target: { value: 'Curso Modificado' } });
      expect(mockTitleChange).toHaveBeenCalledWith('Curso Modificado');
      
      // Guardar
      const saveButton = screen.getByText('Guardar');
      fireEvent.click(saveButton);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it('debería permitir volver atrás', () => {
      const mockBack = jest.fn();
      
      render(
        <EditorCurso 
          isEditing={true}
          onBack={mockBack}
        />
      );
      
      const backButton = screen.getByTestId('arrow-left-icon').closest('button');
      if (backButton) fireEvent.click(backButton);
      
      expect(mockBack).toHaveBeenCalledTimes(1);
    });
  });
});
