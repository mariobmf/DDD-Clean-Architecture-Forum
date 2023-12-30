import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { OnAnswerCreated } from './on-answer-created';
import { makeAnswer } from 'test/factories/make-answer.factory';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { makeQuestion } from 'test/factories/make-question.factory';
import { waitFor } from 'test/utils/wait-for';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

describe('On Answer Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
  });
  it('should send a notification when question has new best answer chosen', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);
    question.bestAnswerId = answer.id;
    inMemoryQuestionsRepository.save(question);

    const sendNotificationExecuteSpy = vi.spyOn(
      sendNotificationUseCase,
      'execute',
    );

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
