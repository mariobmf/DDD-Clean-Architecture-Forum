import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository';
import { ReadNotificationUseCase } from './read-notification';
import { makeNotification } from 'test/factories/make-notification.factory';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/generics/not-allowed.error';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('Read notification use case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });
  it('Should read an notification', async () => {
    const notification = makeNotification();
    inMemoryNotificationsRepository.create(notification);
    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    );
  });
  it('Should NOT read an notification from another recipient', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    });
    await inMemoryNotificationsRepository.create(notification);
    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: notification.id.toString(),
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
