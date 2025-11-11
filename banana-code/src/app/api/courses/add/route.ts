import { CourseController } from "@/controllers/courses.controller";

export const POST = (request: Request) => CourseController.addTeacher(request);
