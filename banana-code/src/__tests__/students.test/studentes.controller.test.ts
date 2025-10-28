import { NextRequest } from 'next/server';
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

type MockUser = {
  id: string;
  name: string | null;
  email: string | null;
  studentCode: string | null;
  phone: string | null;
  role: string;
};

type MockEnrollment = {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  user: MockUser;
  course: {
    id: string;
    name: string;
    code: string;
  };
};

type MockResponse = {
  body: {
    error?: string;
    success?: boolean;
    course?: {
      id: string;
      name: string;
      code: string;
    };
    count?: number;
    students?: unknown[];
  };
  status: number;
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
    enrollment: {
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

    const response = await GET(request) as unknown as MockResponse;

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

    const response = await GET(request) as unknown as MockResponse;

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

    const mockEnrollments: MockEnrollment[] = [
      {
        id: 'enrollment-1',
        userId: 'user-1',
        courseId: courseId,
        enrolledAt: new Date(),
        user: {
          id: 'user-1',
          name: 'Ana Gomez',
          email: 'ana@test.com',
          studentCode: '1001',
          phone: '70123456',
          role: 'ESTUDIANTE',
        },
        course: { id: courseId, name: mockCourse.name, code: mockCourse.code }
      },
      {
        id: 'enrollment-2',
        userId: 'user-2',
        courseId: courseId,
        enrolledAt: new Date(),
        user: {
          id: 'user-2',
          name: 'Carlos Zarate',
          email: 'carlos@test.com',
          studentCode: '1002',
          phone: '70123457',
          role: 'ESTUDIANTE',
        },
        course: { id: courseId, name: mockCourse.name, code: mockCourse.code }
      },
    ];

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams({ courseId }),
      },
    } as unknown as NextRequest;

    (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse);
    (mockPrisma.enrollment.findMany as jest.Mock).mockResolvedValue(mockEnrollments);

    const response = await GET(request) as unknown as MockResponse;

    expect(mockPrisma.course.findUnique).toHaveBeenCalledWith({
      where: { id: courseId },
    });

    expect(mockPrisma.enrollment.findMany).toHaveBeenCalledWith({
      where: {
        courseId: courseId,
        user: {
          role: 'ESTUDIANTE',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentCode: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.course).toEqual({
      id: mockCourse.id,
      name: mockCourse.name,
      code: mockCourse.code,
    });
    expect(response.body.count).toBe(mockEnrollments.length);
    expect(response.body.students).toHaveLength(2);
  });

  // ----- CASO 4: ÉXITO 200 (SIN ESTUDIANTES) -----
  it('should return 200 with an empty list if the course has no students', async () => {
    const courseId = 'course-empty';

    const mockCourse: MockCourse = {
      id: courseId,
      name: 'Curso Vacío',
      code: 'EMPTY-00',
    };

    const mockEnrollments: MockEnrollment[] = [];

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams({ courseId }),
      },
    } as unknown as NextRequest;

    (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse);
    (mockPrisma.enrollment.findMany as jest.Mock).mockResolvedValue(mockEnrollments);

    const response = await GET(request) as unknown as MockResponse;

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
    expect(mockPrisma.enrollment.findMany).toHaveBeenCalled();
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

    const response = await GET(request) as unknown as MockResponse;

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error al obtener estudiantes:',
      dbError
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error interno del servidor' });
  });
});