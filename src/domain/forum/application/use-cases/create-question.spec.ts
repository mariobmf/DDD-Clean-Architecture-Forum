import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { CreateQuestion } from './create-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestion;

describe('Create question use case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new CreateQuestion(inMemoryQuestionsRepository);
  });
  it('Should create an question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'title',
      content: 'Content',
    });

    expect(question.content).toEqual('Content');
    expect(question.title).toEqual('title');
  });
});
