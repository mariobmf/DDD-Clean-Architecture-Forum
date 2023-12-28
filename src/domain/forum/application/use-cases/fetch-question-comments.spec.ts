import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository';
import { makeQuestionComment } from 'test/factories/make-question-comment.factory';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('FetchQuestionCommentsUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });
  it('Should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    );
    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
    });
    expect(result.value?.questionComments).toHaveLength(3);
  });
  it('Should be able to fetch paginated question comments', async () => {
    const amountQuestionComments = 22;
    for (let index = 0; index < amountQuestionComments; index++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
      );
    }
    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    });
    expect(result.value?.questionComments).toHaveLength(2);
  });
});
