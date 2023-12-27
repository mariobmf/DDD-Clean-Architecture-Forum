import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { AnswerQuestion } from './answer-question';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestion;

describe('Answer Question use case', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new AnswerQuestion(inMemoryAnswersRepository);
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
