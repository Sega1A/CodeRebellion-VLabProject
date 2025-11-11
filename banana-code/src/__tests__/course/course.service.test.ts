import { CourseRepository } from "@/repositories/course.repositori";
import { CourseService } from "@/services/course.service";
import { CourseStatus } from "@prisma/client";

jest.mock("@/repositories/course.repositori");

describe("CourseService", () => {
  afterEach(() => jest.clearAllMocks());

  test("coursesByStatus llama al repositorio correctamente", async () => {
    const mockCourses = [{ id: "1", name: "Curso A" }];
    (CourseRepository.getCoursesByStatus as jest.Mock).mockResolvedValue(
      mockCourses
    );

    const result = await CourseService.coursesByStatus(CourseStatus.ACTIVO);

    expect(CourseRepository.getCoursesByStatus).toHaveBeenCalledWith(
      CourseStatus.ACTIVO
    );
    expect(result).toEqual(mockCourses);
  });

  test("changeStatusById llama al repositorio con los parámetros correctos", async () => {
    const mockCourse = { id: "1", status: CourseStatus.INACTIVO };
    (CourseRepository.changeStatusById as jest.Mock).mockResolvedValue(
      mockCourse
    );

    const result = await CourseService.changeStatusById(
      "1",
      CourseStatus.INACTIVO
    );

    expect(CourseRepository.changeStatusById).toHaveBeenCalledWith(
      "1",
      CourseStatus.INACTIVO
    );
    expect(result).toEqual(mockCourse);
  });
});
