import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { GetQuestionUseCase } from './get-question';
import { makeQuestion } from 'test/factories/make-question.factory';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionUseCase;

describe('Get question use case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new GetQuestionUseCase(inMemoryQuestionsRepository);
  });
  it('Should get question by slug', async () => {
    const mockSlug = 'example-question';
    const newQuestion = makeQuestion({ slug: Slug.create(mockSlug) });
    await inMemoryQuestionsRepository.create(newQuestion);
    const result = await sut.execute({
      slug: mockSlug,
    });
    expect(result.value?.question.id).toBeTruthy();
  });
});
