import { QuestionsRepository } from '../repositories/questions-repository';

interface DeleteQuestionRequest {
  authorId: string;
  questionId: string;
}
interface DeleteQuestionResponse {}

export class DeleteQuestion {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute({
    questionId,
    authorId,
  }: DeleteQuestionRequest): Promise<DeleteQuestionResponse> {
    const question = await this.questionRepository.findById(questionId);
    if (!question) throw new Error('Question not found');
    if (authorId !== question.authorId.toString())
      throw new Error('Not allowed');
    await this.questionRepository.delete(question);
    return {};
  }
}
