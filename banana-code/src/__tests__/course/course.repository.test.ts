import { prisma } from "@/lib/prisma";
import { CourseRepository } from "@/repositories/course.repositori";
import { CourseStatus } from "@prisma/client";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    course: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("CourseRepository", () => {
  afterEach(() => jest.clearAllMocks());

  test("getCoursesByStatus llama a prisma.course.findMany con el estado correcto", async () => {
    const mockCourses = [{ id: "1", name: "Curso A" }];
    (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

    const result = await CourseRepository.getCoursesByStatus(
      CourseStatus.ACTIVO
    );

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      where: { status: CourseStatus.ACTIVO },
    });
    expect(result).toEqual(mockCourses);
  });

  test("changeStatusById actualiza correctamente el estado del curso", async () => {
    const mockCourse = { id: "1", status: CourseStatus.ACTIVO };
    (prisma.course.update as jest.Mock).mockResolvedValue(mockCourse);

    const result = await CourseRepository.changeStatusById(
      "1",
      CourseStatus.ACTIVO
    );

    expect(prisma.course.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { status: CourseStatus.ACTIVO },
    });
    expect(result).toEqual(mockCourse);
  });
});
