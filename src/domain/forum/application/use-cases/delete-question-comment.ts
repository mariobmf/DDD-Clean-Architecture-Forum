import { Either, left, right } from '@/core/either';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { ResourceNotFoundError } from '@/core/errors/generics/resource-not-found.error';
import { NotAllowedError } from '@/core/errors/generics/not-allowed.error';

interface DeleteQuestionCommentRequest {
  authorId: string;
  questionCommentId: string;
}
type DeleteQuestionCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}
  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentRequest): Promise<DeleteQuestionCommentResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId);
    if (!questionComment) return left(new ResourceNotFoundError());
    if (authorId !== questionComment.authorId.toString())
      return left(new NotAllowedError());
    await this.questionCommentsRepository.delete(questionComment);
    return right(null);
  }
}
