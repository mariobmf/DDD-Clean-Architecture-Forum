import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface CreateQuestionRequest {
  authorId: string;
  title: string;
  content: string;
}
interface CreateQuestionResponse {
  question: Question;
}

export class CreateQuestion {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute({
    content,
    authorId,
    title,
  }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    });

    await this.questionRepository.create(question);

    return { question };
  }
}
