import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { GetQuestion } from './get-question';
import { makeQuestion } from 'test/factories/make-question.factory';
import { Slug } from '../../enterprise/entities/value-objects/slug';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestion;

describe('Get question use case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestion(inMemoryQuestionsRepository);
  });
  it('Should get question by slug', async () => {
    const mockSlug = 'example-question';
    const newQuestion = makeQuestion({ slug: Slug.create(mockSlug) });
    await inMemoryQuestionsRepository.create(newQuestion);
    const { question } = await sut.execute({
      slug: mockSlug,
    });
    expect(question.id).toBeTruthy();
  });
});
