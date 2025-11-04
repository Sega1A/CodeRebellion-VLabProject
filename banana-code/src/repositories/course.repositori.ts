import { prisma } from "@/lib/prisma";
import { CourseStatus } from "@prisma/client";

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
};
