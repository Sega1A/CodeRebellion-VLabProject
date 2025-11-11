import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/courses/[id] - Obtener un curso por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const course: any = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Mapear al formato esperado por el frontend
    const mappedCourse = {
      id: course.id,
      title: course.name,
      description: course.description || '',
      students: course.students || 0,
      topics: course.topics || 0,
      progress: course.progress || 0,
      lastUpdated: course.updatedAt.toISOString(),
      content: course.content || { topics: [] },
    };

    return NextResponse.json(mappedCourse);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Error al obtener el curso' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Actualizar un curso
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, content } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedCourse: any = await prisma.course.update({
      where: {
        id: params.id,
      },
      data: {
        name: title,
        description,
        content,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    // Mapear al formato esperado por el frontend
    const mappedCourse = {
      id: updatedCourse.id,
      title: updatedCourse.name,
      description: updatedCourse.description || '',
      students: updatedCourse.students || 0,
      topics: updatedCourse.topics || 0,
      progress: updatedCourse.progress || 0,
      lastUpdated: updatedCourse.updatedAt.toISOString(),
      content: updatedCourse.content || { topics: [] },
    };

    return NextResponse.json(mappedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el curso' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Eliminar un curso
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.course.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Curso eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el curso' },
      { status: 500 }
    );
  }
}
