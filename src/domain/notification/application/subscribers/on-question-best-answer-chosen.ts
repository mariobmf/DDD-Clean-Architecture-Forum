import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { QuestionBestQuestionChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event';

export class OnAnswerBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerChosenNotification.bind(this),
      QuestionBestQuestionChosenEvent.name,
    );
  }

  private async sendQuestionBestAnswerChosenNotification({
    question,
    bestAnswerId,
  }: QuestionBestQuestionChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer)
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que você enviou em "${question.title.substring(
          0,
          20,
        )}..." foi escolhida pelo autor`,
      });
  }
}
