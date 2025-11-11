import { CourseRepository } from "@/repositories/course.repositori";
import { CourseStatus, Role } from "@prisma/client";

export const CourseService = {
  async coursesByStatus(status: CourseStatus) {
    return await CourseRepository.getCoursesByStatus(status);
  },
  async changeStatusById(id: string, status: CourseStatus) {
    if (status === CourseStatus.ACTIVO) {
      await CourseRepository.changeActiveCoursesIntoInactive();
    }
    return await CourseRepository.changeStatusById(id, status);
  },
  async addTeacherToCourse(
    idCourse: string,
    idTeacher: string,
    teacherRole: Role
  ) {
    return await CourseRepository.insertTeacherToCourse(
      idCourse,
      idTeacher,
      teacherRole
    );
  },
  async getTeachersInCourse(idCourse: string) {
    const courseTeachers = await CourseRepository.teachersByCourseId(idCourse);
    return courseTeachers.map((ct) => ct.user);
  },
};
