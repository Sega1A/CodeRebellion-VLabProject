import { TopicsRepository } from "@/repositories/topics.repository";

export const TopicService = {
  async topicsByCourseId(idCourse: string) {
    return await TopicsRepository.getTopicsByCourseId(idCourse);
  },
};
