import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';
import { makeAnswer } from 'test/factories/make-answer.factory';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe('FetchQuestionAnswersUseCase', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });
  it('Should be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    );
    const { answers } = await sut.execute({
      page: 1,
      questionId: 'question-1',
    });
    expect(answers).toHaveLength(3);
  });
  it('Should be able to fetch paginated question answers', async () => {
    const amountAnswers = 22;
    for (let index = 0; index < amountAnswers; index++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('question-1') }),
      );
    }
    const { answers } = await sut.execute({
      page: 2,
      questionId: 'question-1',
    });
    expect(answers).toHaveLength(2);
  });
});
