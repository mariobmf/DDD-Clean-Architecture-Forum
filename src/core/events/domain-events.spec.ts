import { vi } from 'vitest';
import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityId } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';

class CustomAggregateCreatedEvent implements DomainEvent {
  public readonly occurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.occurredAt = new Date();
    this.aggregate = aggregate;
  }

  get ocurredAt(): Date {
    return this.occurredAt;
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }
}
class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);
    aggregate.addDomainEvent(new CustomAggregateCreatedEvent(aggregate));
    return aggregate;
  }
}

describe('Domain Events', () => {
  it('Should dispatch and listen to the events', () => {
    const callbackSpy = vi.fn();

    // I create a subscriber to listen to the event and execute what needs to be done with the data.
    DomainEvents.register(callbackSpy, CustomAggregateCreatedEvent.name);

    // Creates the aggregate and registers the event.
    const aggregate = CustomAggregate.create();

    // I assure you that the event was created; however, it was not dispatched.
    expect(aggregate.domainEvents).toHaveLength(1);

    // Dispatch the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // I assure you that the event was listened to and executed the necessary actions.
    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
