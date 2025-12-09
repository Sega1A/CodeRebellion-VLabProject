import { CourseController } from "@/controllers/courses.controller";

export const GET = (request: Request) =>
  CourseController.coursesByStatus(request);
export const PUT = (request: Request) =>
  CourseController.changeStatusById(request);
