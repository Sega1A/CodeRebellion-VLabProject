import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/students?courseId=xxx
 * Obtiene la lista de estudiantes (usuarios con role ESTUDIANTE) de un curso específico
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

    // Obtener los estudiantes inscritos en el curso
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId: courseId,
        user: {
          role: 'ESTUDIANTE', // Solo usuarios con rol estudiante
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

    // Transformar los datos para que coincidan con el formato esperado
    const students = enrollments.map((enrollment) => ({
      id: enrollment.user.id,
      firstName: enrollment.user.name?.split(' ')[0] || '',
      lastName: enrollment.user.name?.split(' ').slice(1).join(' ') || '',
      email: enrollment.user.email || '',
      studentCode: enrollment.user.studentCode || '',
      phone: enrollment.user.phone || '',
      enrolledAt: enrollment.enrolledAt,
      course: enrollment.course,
    }));

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
