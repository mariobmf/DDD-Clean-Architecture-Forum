import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { CreateQuestionUseCase } from './create-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe('Create question use case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });
  it('Should create an question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'title',
      content: 'Content',
    });
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryQuestionsRepository.items[0].content).toEqual('Content');
    expect(inMemoryQuestionsRepository.items[0].title).toEqual('title');
  });
});
