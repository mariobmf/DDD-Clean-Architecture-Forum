import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe('Create question use case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });
  it('Should create an question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'title',
      content: 'Content',
      attachmentsIds: ['1', '2'],
    });
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryQuestionsRepository.items[0].content).toEqual('Content');
    expect(inMemoryQuestionsRepository.items[0].title).toEqual('title');
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
  });
});
