import { CourseRepository } from "@/repositories/course.repositori";
import { CourseStatus } from "@prisma/client";

export const CourseService = {
  async coursesByStatus(status: CourseStatus) {
    return await CourseRepository.getCoursesByStatus(status);
  },
  async changeStatusById(id: string, status: CourseStatus) {
    return await CourseRepository.changeStatusById(id, status);
  },
};
