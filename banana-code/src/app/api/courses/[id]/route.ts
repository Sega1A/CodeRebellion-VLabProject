import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Course } from "@prisma/client";

interface RouteContext {
  params: {
    id: string;
  };
}

interface CourseContent {
  topics: {
    id: string;
    title: string;
    subtopics: unknown[];
  }[];
}

type CourseResponse = {
  id: string;
  title: string;
  description: string;
  students: number;
  topics: number;
  progress: number;
  lastUpdated: string;
  content: CourseContent | null;
};

type CourseWithMetrics = Course & {
  name: string;
  students?: number;
  topics?: number;
  progress?: number;
  content: CourseContent | null;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<CourseResponse | { error: string }>> {
  const { id } = context.params;
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    const fullCourse = course as CourseWithMetrics;

    const mappedCourse: CourseResponse = {
      id: fullCourse.id,
      title: fullCourse.name,
      description: fullCourse.description || "",
      students: fullCourse.students || 0,
      topics: fullCourse.topics || 0,
      progress: fullCourse.progress || 0,
      lastUpdated: fullCourse.updatedAt.toISOString(),
      content: fullCourse.content || { topics: [] },
    };

    return NextResponse.json(mappedCourse);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Error al obtener el curso" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<CourseResponse | { error: string }>> {
  const { id } = context.params;
  try {
    const body = await request.json();
    const { title, description, content } = body;

    const updatedCourse = (await prisma.course.update({
      where: {
        id: id,
      },
      data: {
        name: title,
        description,
        content: content,
      },
    })) as CourseWithMetrics;

    const mappedCourse: CourseResponse = {
      id: updatedCourse.id,
      title: updatedCourse.name,
      description: updatedCourse.description || "",
      students: updatedCourse.students || 0,
      topics: updatedCourse.topics || 0,
      progress: updatedCourse.progress || 0,
      lastUpdated: updatedCourse.updatedAt.toISOString(),
      content: updatedCourse.content || { topics: [] },
    };

    return NextResponse.json(mappedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Error al actualizar el curso" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<{ message: string } | { error: string }>> {
  const { id } = context.params;
  try {
    await prisma.course.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Curso eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Error al eliminar el curso" },
      { status: 500 }
    );
  }
}
