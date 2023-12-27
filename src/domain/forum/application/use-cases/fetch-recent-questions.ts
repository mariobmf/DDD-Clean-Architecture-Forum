import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface FetchRecentQuestionsRequest {
  page: number;
}
interface FetchRecentQuestionsResponse {
  questions: Question[];
}

export class FetchRecentQuestions {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute({
    page,
  }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionRepository.findManyRecent({ page });
    return { questions };
  }
}
