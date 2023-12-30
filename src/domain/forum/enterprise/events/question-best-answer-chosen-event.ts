import { DomainEvent } from '@/core/events/domain-event';
import { Question } from '../entities/question';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class QuestionBestQuestionChosenEvent implements DomainEvent {
  private readonly _ocurredAt: Date;
  private _question: Question;
  private _bestAnswerId: UniqueEntityId;

  constructor(question: Question, bestAnswerId: UniqueEntityId) {
    this._ocurredAt = new Date();
    this._question = question;
    this._bestAnswerId = bestAnswerId;
  }

  get ocurredAt() {
    return this._ocurredAt;
  }

  get question() {
    return this._question;
  }

  get bestAnswerId() {
    return this._bestAnswerId;
  }

  public getAggregateId() {
    return this._question.id;
  }
}
