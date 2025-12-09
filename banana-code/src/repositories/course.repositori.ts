import { prisma } from "@/lib/prisma";
import { CourseStatus, Role } from "@prisma/client";

export const CourseRepository = {
  getCoursesByStatus: (status: CourseStatus) =>
    prisma.course.findMany({ where: { status } }),
  changeStatusById: (id: string, status: CourseStatus) =>
    prisma.course.update({ where: { id }, data: { status } }),
  changeActiveCoursesIntoInactive: () =>
    prisma.course.updateMany({
      where: { status: CourseStatus.ACTIVO },
      data: { status: CourseStatus.INACTIVO },
    }),
  insertTeacherToCourse: (idCourse: string, idTeacher: string, role: Role) =>
    prisma.courseTeacher.create({
      data: { courseId: idCourse, userId: idTeacher, role: role },
    }),
  teachersByCourseId: (idCourse: string) =>
    prisma.courseTeacher.findMany({
      where: { courseId: idCourse },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            phone: true,
          },
        },
      },
    }),
};
