import { DomainEvent } from '@/core/events/domain-event';
import { Answer } from '../entities/answer';

export class AnswerCreatedEvent implements DomainEvent {
  private readonly _ocurredAt: Date;
  private _answer: Answer;

  constructor(answer: Answer) {
    this._ocurredAt = new Date();
    this._answer = answer;
  }

  get ocurredAt() {
    return this._ocurredAt;
  }

  get answer() {
    return this._answer;
  }

  public getAggregateId() {
    return this._answer.id;
  }
}
