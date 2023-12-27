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
    const answer = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'Content',
    });

    expect(answer.content).toEqual('Content');
  });
});
