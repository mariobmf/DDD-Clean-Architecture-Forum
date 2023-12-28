import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { AnswerQuestionUseCase } from './answer-question';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe('Answer Question use case', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it('Should create an answer', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'Content',
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswersRepository.items[0].id).toEqual(
      result.value?.answer.id,
    );
  });
});
