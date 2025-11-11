// Tipos
export type EstadoRegistrado = "Activo" | "Borrador";
export type EstadoHistorico = "Histórico";

export type CursoBase = {
  id: string;
  nombre: string;
  docente: string;
  fechaInicio: string;
  fechaFin: string;
};

export type CursoRegistrado = CursoBase & { estado: EstadoRegistrado };
export type CursoHistorico = CursoBase & { estado: EstadoHistorico };

// Registrados: solo "Activo" o "Borrador" (uno activo máximo)
export const cursosRegistrados: CursoRegistrado[] = [
  {
    id: "c-001",
    nombre: "Introducción a la Informática",
    docente: "Ing. Emir Vargas",
    fechaInicio: "2025-09-01",
    fechaFin: "2025-11-30",
    estado: "Activo", // ← único activo inicial
  },
  {
    id: "c-002",
    nombre: "Matemáticas Básicas",
    docente: "Lic. Patricia Rodríguez",
    fechaInicio: "2025-08-15",
    fechaFin: "2025-12-10",
    estado: "Borrador",
  },
  {
    id: "c-003",
    nombre: "Programación con TypeScript",
    docente: "Ing. Nicole Flores",
    fechaInicio: "2025-10-05",
    fechaFin: "2025-12-20",
    estado: "Borrador",
  },
];

// Históricos: solo "Histórico"
export const cursosHistoricos: CursoHistorico[] = [
  {
    id: "h-101",
    nombre: "Base de Datos I",
    docente: "Ing. Fernando Muñoz",
    fechaInicio: "2025-03-01",
    fechaFin: "2025-06-15",
    estado: "Histórico",
  },
  {
    id: "h-102",
    nombre: "Algoritmos y Estructuras",
    docente: "Ing. Mayra Salinas",
    fechaInicio: "2024-09-01",
    fechaFin: "2024-12-10",
    estado: "Histórico",
  },
];
