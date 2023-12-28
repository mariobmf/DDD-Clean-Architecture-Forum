import { Either, left, right } from '@/core/either';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { NotAllowedError } from './errors/not-allowed.error';

interface DeleteAnswerCommentRequest {
  authorId: string;
  answerCommentId: string;
}
type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}
  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId);
    if (!answerComment) return left(new ResourceNotFoundError());
    if (authorId !== answerComment.authorId.toString())
      return left(new NotAllowedError());
    await this.answerCommentsRepository.delete(answerComment);
    return right(null);
  }
}
