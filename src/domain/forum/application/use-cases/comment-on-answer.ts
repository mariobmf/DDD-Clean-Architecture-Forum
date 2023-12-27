import { AnswersRepository } from '../repositories/answers-repository';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface CommentOnAnswerRequest {
  authorId: string;
  answerId: string;
  content: string;
}
interface CommentOnAnswerResponse {
  answerComment: AnswerComment;
}

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
    if (!answer) throw new Error('Answer not found');
    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      content,
      answerId: new UniqueEntityId(answerId),
    });
    await this.answerCommentsRepository.create(answerComment);
    return { answerComment };
  }
}
