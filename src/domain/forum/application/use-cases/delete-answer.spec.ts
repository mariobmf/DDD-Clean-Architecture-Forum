import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { DeleteAnswerUseCase } from './delete-answer';
import { makeAnswer } from 'test/factories/make-answer.factory';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed.error';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe('Delete answer use case', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });
  it('Should delete an answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    );
    await inMemoryAnswersRepository.create(newAnswer);
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    });
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswersRepository.items).toHaveLength(0);
  });
  it('Should NOT delete an answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    );
    await inMemoryAnswersRepository.create(newAnswer);
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
