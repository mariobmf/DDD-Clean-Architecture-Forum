import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { makeQuestion } from 'test/factories/make-question.factory';
import { FetchRecentQuestions } from './fetch-recent-questions';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestions;

describe('Fetch recent questions use case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new FetchRecentQuestions(inMemoryQuestionsRepository);
  });
  it('Should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2023, 0, 3) }),
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2023, 0, 2) }),
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2023, 0, 1) }),
    );
    const { questions } = await sut.execute({
      page: 1,
    });
    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 0, 3) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 2) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 1) }),
    ]);
  });
  it('Should be able to fetch paginated recent questions', async () => {
    const amountQuestions = 22;
    for (let index = 0; index < amountQuestions; index++) {
      await inMemoryQuestionsRepository.create(makeQuestion());
    }

    const { questions } = await sut.execute({
      page: 2,
    });
    expect(questions).toHaveLength(2);
  });
});
