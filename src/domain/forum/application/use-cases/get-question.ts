import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface GetQuestionRequest {
  slug: string;
}
interface GetQuestionResponse {
  question: Question;
}

export class GetQuestion {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute({ slug }: GetQuestionRequest): Promise<GetQuestionResponse> {
    const question = await this.questionRepository.findBySlug(slug);

    if (!question) throw new Error('Question not found');

    return { question };
  }
}
