import { AnswersRepository } from '../repositories/answers-repository';

interface DeleteAnswerRequest {
  authorId: string;
  answerId: string;
}
interface DeleteAnswerResponse {}

export class DeleteAnswer {
  constructor(private answerRepository: AnswersRepository) {}
  async execute({
    answerId,
    authorId,
  }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer) throw new Error('Answer not found');
    if (authorId !== answer.authorId.toString()) throw new Error('Not allowed');
    await this.answerRepository.delete(answer);
    return {};
  }
}
