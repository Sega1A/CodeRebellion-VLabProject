import { TopicController } from "@/controllers/topics.controller";

export const POST = (request: Request) =>
  TopicController.getTopicsByCourseId(request);
