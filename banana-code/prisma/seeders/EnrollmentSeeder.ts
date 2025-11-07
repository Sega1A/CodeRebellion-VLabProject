import { PrismaClient } from "@prisma/client";
import { createdUsers } from "./AccountSeeder";
import { createdCourses } from "./CourseSeeder";
import { randomUUID } from "crypto";

export async function seedEnrollments(prisma: PrismaClient) {
  console.log("Agregando inscripciones de estudiantes a Cursos");

  const course = createdCourses.find((c) => c.code === "P101");
  if (!course || createdUsers.length === 0) {
    console.warn(
      "¡ADVERTENCIA! No se encontraron suficientes Usuarios o Cursos para crear inscripciones."
    );
    return;
  }

  const ENROLLMENTS_DATA = createdUsers.map((student) => {
    return {
      userId: student.id,
      courseId: course.id,
    };
  });

  for (const data of ENROLLMENTS_DATA) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: data.userId,
          courseId: data.courseId,
        },
      },
      update: {},
      create: {
        id: randomUUID(),
        userId: data.userId,
        courseId: data.courseId,
      },
    });
  }

  console.log("Datos de Inscripciones finalizada.");
}
