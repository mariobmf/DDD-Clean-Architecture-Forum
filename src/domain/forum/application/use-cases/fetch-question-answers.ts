import { AnswersRepository } from '../repositories/answers-repository';
import { Answer } from '../../enterprise/entities/answer';
import { Either, right } from '@/core/either';

interface FetchQuestionAnswersRequest {
  questionId: string;
  page: number;
}
type FetchQuestionAnswersResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}
  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    );
    return right({ answers });
  }
}
