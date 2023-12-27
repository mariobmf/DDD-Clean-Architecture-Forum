import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface DeleteAnswerCommentRequest {
  authorId: string;
  answerCommentId: string;
}
interface DeleteAnswerCommentResponse {}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}
  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId);
    if (!answerComment) throw new Error('Answer comment not found');
    if (authorId !== answerComment.authorId.toString())
      throw new Error('Not allowed');
    await this.answerCommentsRepository.delete(answerComment);
    return {};
  }
}
