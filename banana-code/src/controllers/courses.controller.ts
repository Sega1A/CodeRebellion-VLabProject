import { CourseService } from "@/services/course.service";
import { UserService } from "@/services/user.service";
import { CourseStatus, Role } from "@prisma/client";
import { NextResponse } from "next/server";

export const CourseController = {
  async coursesByStatus(request: Request) {
    try {
      const url = new URL(request.url);
      const statusParam = url.searchParams.get("status");
      if (!statusParam) {
        return NextResponse.json(
          { error: "Missing 'status' query parameter" },
          { status: 400 }
        );
      }
      const status: CourseStatus = statusParam as CourseStatus;
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
  async addTeacher(request: Request) {
    try {
      const { idCourse, idTeacher } = await request.json();

      const user = await UserService.findUserById(idTeacher);
      const response = await CourseService.addTeacherToCourse(
        idCourse,
        idTeacher,
        user?.role ?? Role.PROFESOR_EJECUTOR
      );
      return NextResponse.json(response);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al obtener los cursos";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },
  async getTeachers(request: Request) {
    try {
      const { idCourse } = await request.json();
      const response = await CourseService.getTeachersInCourse(idCourse);
      return NextResponse.json(response);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al obtener los cursos";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },
};
