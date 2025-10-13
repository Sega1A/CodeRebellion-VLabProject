import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/students?courseId=xxx
 * Obtiene la lista de estudiantes de un curso específico
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');

    // Validar que se proporcione el courseId
    if (!courseId) {
      return NextResponse.json(
        { error: 'El parámetro courseId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el curso existe
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Obtener los estudiantes del curso
    const students = await prisma.student.findMany({
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

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        name: course.name,
        code: course.code,
      },
      count: students.length,
      students: students,
    });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
