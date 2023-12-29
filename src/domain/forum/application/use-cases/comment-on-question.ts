import { QuestionsRepository } from '../repositories/questions-repository';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/generics/resource-not-found.error';

interface CommentOnQuestionRequest {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}
  async execute({
    content,
    authorId,
    questionId,
  }: CommentOnQuestionRequest): Promise<CommentOnQuestionResponse> {
    const question = await this.questionsRepository.findById(questionId);
    if (!question) return left(new ResourceNotFoundError());
    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      content,
      questionId: new UniqueEntityId(questionId),
    });
    await this.questionCommentsRepository.create(questionComment);
    return right({ questionComment });
  }
}
