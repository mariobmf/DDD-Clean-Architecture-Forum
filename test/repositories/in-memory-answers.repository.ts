import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments.repository';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id);
    this.items.splice(answerIndex, 1);
    this.inMemoryAnswerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.toString(),
    );
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id);
    this.items[answerIndex] = answer;
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id);
    return answer ?? null;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answer = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answer;
  }
}
