import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { makeAnswer } from 'test/factories/make-answer.factory';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { makeQuestion } from 'test/factories/make-question.factory';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose question best answer use case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    );
  });
  it('Should be able to choose the question best answer', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });
    await inMemoryAnswersRepository.create(answer);
    await inMemoryQuestionsRepository.create(question);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });
    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
      answer.id,
    );
  });
  it('Should NOT be able to choose another user question best answer', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityId('author-1') });
    const answer = makeAnswer({ questionId: question.id });
    await inMemoryAnswersRepository.create(answer);
    await inMemoryQuestionsRepository.create(question);

    expect(() =>
      sut.execute({
        answerId: answer.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
