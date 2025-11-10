import { CourseService } from "@/services/course.service";
import { CourseStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export const CourseController = {
  async coursesByStatus(request: Request) {
    try {
      const url = new URL(request.url);
      const status: CourseStatus = url.searchParams.get("status");
      const courses = await CourseService.coursesByStatus(status);
      return NextResponse.json(courses);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al obtener los cursos";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },
  async changeStatusById(request: Request) {
    try {
      const { id, status } = await request.json();
      console.log(status, id);
      const response = await CourseService.changeStatusById(id, status);
      return NextResponse.json(response);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al obtener los cursos";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },
};
