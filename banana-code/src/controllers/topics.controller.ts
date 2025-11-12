import { TopicService } from "@/services/topics.service";
import { NextResponse } from "next/server";

export const TopicController = {
  async getTopicsByCourseId(request: Request) {
    try {
      const { idCourse } = await request.json();
      const response = await TopicService.topicsByCourseId(idCourse);
      return NextResponse.json(response);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al obtener los cursos";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },
  async updateTopicById(request: Request) {
    try {
      const { topicId, courseId } = await request.json();
      const response = await TopicService.topicsByCourseId(idCourse);
      return NextResponse.json(response);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al obtener los cursos";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },
};
