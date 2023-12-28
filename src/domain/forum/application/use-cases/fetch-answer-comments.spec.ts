import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository';
import { makeAnswerComment } from 'test/factories/make-answer-comment.factory';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('FetchAnswerCommentsUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });
  it('Should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    );
    const result = await sut.execute({
      page: 1,
      answerId: 'answer-1',
    });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.answerComments).toHaveLength(3);
  });
  it('Should be able to fetch paginated answer comments', async () => {
    const amountAnswerComments = 22;
    for (let index = 0; index < amountAnswerComments; index++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
      );
    }
    const result = await sut.execute({
      page: 2,
      answerId: 'answer-1',
    });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.answerComments).toHaveLength(2);
  });
});
