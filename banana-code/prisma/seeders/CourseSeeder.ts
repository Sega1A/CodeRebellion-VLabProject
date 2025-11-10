import { PrismaClient, Course, CourseStatus } from "@prisma/client";
import { randomUUID } from "crypto";

const COURSES_DATA = [
  {
    name: "Introduccion a la programacion con Python. Gestion 2/2025",
    description:
      "Aprende sobre la programacion con este curso introductorio en Python",
    code: "P101",
    startDate: new Date("2025-08-15"),
    endDate: new Date("2025-12-26"),
    status: CourseStatus.ACTIVO,
  },
  {
    name: "Introduccion a la programacion con Python. Gestion 1/2026",
    description:
      "Aprende sobre la programacion con este curso introductorio en Python",
    code: "P101",
    startDate: new Date("2026-02-10"),
    endDate: new Date("2026-06-05"),
    status: CourseStatus.BORRADOR,
  },
];

export const createdCourses: Course[] = [];

export async function seedCourses(prisma: PrismaClient) {
  console.log("Eliminando Cursos...");
  await prisma.course.deleteMany();
  console.log("Cursos eliminados");

  console.log("Agregando cursos...");
  for (const data of COURSES_DATA) {
    const course = await prisma.course.upsert({
      where: { code: data.code },
      update: {},
      create: {
        id: randomUUID(),
        name: data.name,
        description: data.description,
        code: data.code,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      },
    });
    createdCourses.push(course);
    console.log(createdCourses);
    console.log(`Curso creado: ${course.name}`);
  }

  console.log("Datos de Cursos finalizada.");
}
