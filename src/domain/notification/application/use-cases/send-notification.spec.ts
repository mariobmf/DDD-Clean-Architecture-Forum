import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository';
import { SendNotificationUseCase } from './send-notification';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('Send notification use case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });
  it('Should send an notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'title',
      content: 'Content',
    });
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationsRepository.items[0].content).toEqual('Content');
    expect(inMemoryNotificationsRepository.items[0].title).toEqual('title');
  });
});
