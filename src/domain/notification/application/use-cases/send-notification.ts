import { Either, right } from '@/core/either';
import { Notification } from '../../enterprise/entities/notification';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotificationsRepository } from '../repositories/notifications-repository';

interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}
type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}
  async execute({
    content,
    recipientId,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    });

    await this.notificationRepository.create(notification);

    return right({ notification });
  }
}
