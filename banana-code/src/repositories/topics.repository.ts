import { prisma } from "@/lib/prisma";

export const TopicsRepository = {
  getTopicsByCourseId: (idCourse: string) =>
    prisma.course.findMany({
      select: { content: true },
      where: { id: idCourse },
    }),
};
