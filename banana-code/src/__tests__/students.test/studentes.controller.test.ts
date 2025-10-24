import { NextRequest, NextResponse } from 'next/server';
import { GET } from '../../app/api/students/route';
import prisma from '@/lib/prisma';

// ---------------------------------
// TYPES (TIPOS)
// ---------------------------------

type MockCourse = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

type MockStudent = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentCode: string;
  enrolledAt: Date;
  course: {
    id: string;
    name: string;
    code: string;
  };
};

// ---------------------------------
// MOCKS (SIMULACIONES)
// ---------------------------------

// Simular el cliente de Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    course: {
      findUnique: jest.fn(),
    },
    student: {
      findMany: jest.fn(),
    },
  },
}));

// Simular NextResponse.json para capturar sus salidas
// Hacemos que devuelva lo que se le pasó para poder inspeccionarlo
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    ...jest.requireActual('next/server').NextResponse,
    json: jest.fn((body, init) => ({
      body,
      status: init?.status || 200,
    })),
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// ---------------------------------
// SUITE DE TESTS
// ---------------------------------

describe('GET /api/students', () => {

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // ----- CASO 1: ERROR 400 -----
  it('should return a 400 error if courseId is not provided', async () => {

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    } as unknown as NextRequest;

    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'El parámetro courseId es requerido' });
  });

  // ----- CASO 2: ERROR 404 -----
  it('should return a 404 error if the course is not found', async () => {
    const courseId = 'course-non-existent';

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams({ courseId }),
      },
    } as unknown as NextRequest;

    (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await GET(request);

    expect(mockPrisma.course.findUnique).toHaveBeenCalledWith({
      where: { id: courseId },
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Curso no encontrado' });
  });

  // ----- CASO 3: ÉXITO 200 (CON ESTUDIANTES) -----
  it('should return 200 with the list of students if the course is found', async () => {
    const courseId = 'course-123';

    const mockCourse: MockCourse = {
      id: courseId,
      name: 'Ingeniería de Software',
      code: 'IS-101',
    };

    const mockStudents: MockStudent[] = [
      {
        id: 'student-1',
        firstName: 'Ana',
        lastName: 'Gomez',
        email: 'ana@test.com',
        studentCode: '1001',
        enrolledAt: new Date(),
        course: { id: courseId, name: mockCourse.name, code: mockCourse.code }
      },
      {
        id: 'student-2',
        firstName: 'Carlos',
        lastName: 'Zarate',
        email: 'carlos@test.com',
        studentCode: '1002',
        enrolledAt: new Date(),
        course: { id: courseId, name: mockCourse.name, code: mockCourse.code }
      },
    ];

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams({ courseId }),
      },
    } as unknown as NextRequest;

    (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse);
    (mockPrisma.student.findMany as jest.Mock).mockResolvedValue(mockStudents);

    const response = await GET(request);

    expect(mockPrisma.course.findUnique).toHaveBeenCalledWith({
      where: { id: courseId },
    });

    expect(mockPrisma.student.findMany).toHaveBeenCalledWith({
      where: {
        courseId: courseId,
      },
      orderBy: {
        lastName: 'asc',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        studentCode: true,
        enrolledAt: true,
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      course: {
        id: mockCourse.id,
        name: mockCourse.name,
        code: mockCourse.code,
      },
      count: mockStudents.length,
      students: mockStudents,
    });
  });

  // ----- CASO 4: ÉXITO 200 (SIN ESTUDIANTES) -----
  it('should return 200 with an empty list if the course has no students', async () => {
    const courseId = 'course-empty';

    const mockCourse: MockCourse = {
      id: courseId,
      name: 'Curso Vacío',
      code: 'EMPTY-00',
    };

    const mockStudents: MockStudent[] = [];

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams({ courseId }),
      },
    } as unknown as NextRequest;

    (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse);
    (mockPrisma.student.findMany as jest.Mock).mockResolvedValue(mockStudents);

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      course: {
        id: mockCourse.id,
        name: mockCourse.name,
        code: mockCourse.code,
      },
      count: 0,
      students: [],
    });
    expect(mockPrisma.student.findMany).toHaveBeenCalled();
  });


  // ----- CASO 5: ERROR 500 -----
  it('should return a 500 error if the database query fails', async () => {
    const courseId = 'course-failing';
    const dbError = new Error('Database connection failed');

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams({ courseId }),
      },
    } as unknown as NextRequest;

    (mockPrisma.course.findUnique as jest.Mock).mockRejectedValue(dbError);

    const response = await GET(request);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error al obtener estudiantes:',
      dbError
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error interno del servidor' });
  });
});