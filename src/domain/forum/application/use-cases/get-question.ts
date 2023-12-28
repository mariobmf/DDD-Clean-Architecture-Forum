import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';
import { Either, right } from '@/core/either';

interface GetQuestionUseCaseRequest {
  slug: string;
}
type GetQuestionUseCaseResponse = Either<
  null,
  {
    question: Question;
  }
>;

export class GetQuestionUseCase {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute({
    slug,
  }: GetQuestionUseCaseRequest): Promise<GetQuestionUseCaseResponse> {
    const question = await this.questionRepository.findBySlug(slug);

    if (!question) throw new Error('Question not found');

    return right({ question });
  }
}
