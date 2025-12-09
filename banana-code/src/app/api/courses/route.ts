import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/courses - Obtener todos los cursos
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Mapear los cursos al formato esperado por el frontend
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedCourses = courses.map((course: any) => ({
      id: course.id,
      title: course.name,
      description: course.description || '',
      students: course.students || 0,
      topics: course.topics || 0,
      progress: course.progress || 0,
      lastUpdated: course.updatedAt.toISOString(),
      content: course.content || { topics: [] },
    }));

    return NextResponse.json(mappedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Error al obtener los cursos' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Crear un nuevo curso
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newCourse: any = await prisma.course.create({
      data: {
        name: title || 'Nuevo Curso',
        description: description || 'Descripción del curso',
        content: content || { topics: [] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    // Mapear al formato esperado por el frontend
    const mappedCourse = {
      id: newCourse.id,
      title: newCourse.name,
      description: newCourse.description || '',
      students: newCourse.students || 0,
      topics: newCourse.topics || 0,
      progress: newCourse.progress || 0,
      lastUpdated: newCourse.updatedAt.toISOString(),
      content: newCourse.content || { topics: [] },
    };

    return NextResponse.json(mappedCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Error al crear el curso' },
      { status: 500 }
    );
  }
}

