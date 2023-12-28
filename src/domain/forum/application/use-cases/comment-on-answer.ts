import { AnswersRepository } from '../repositories/answers-repository';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { Either, left, right } from '@/core/either';

interface CommentOnAnswerRequest {
  authorId: string;
  answerId: string;
  content: string;
}
type CommentOnAnswerResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}
  async execute({
    content,
    authorId,
    answerId,
  }: CommentOnAnswerRequest): Promise<CommentOnAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId);
    if (!answer) return left(new ResourceNotFoundError());
    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      content,
      answerId: new UniqueEntityId(answerId),
    });
    await this.answerCommentsRepository.create(answerComment);
    return right({ answerComment });
  }
}
