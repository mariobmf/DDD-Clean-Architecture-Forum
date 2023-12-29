import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification';

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId,
) {
  return Notification.create(
    {
      recipientId: new UniqueEntityId(),
      content: faker.lorem.sentence(10),
      title: faker.lorem.sentence(6),
      ...override,
    },
    id,
  );
}
