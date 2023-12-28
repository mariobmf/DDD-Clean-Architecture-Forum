import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { EditAnswerUseCase } from './edit-answer';
import { makeAnswer } from 'test/factories/make-answer.factory';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed.error';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit answer use case', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepository);
  });
  it('Should edit an answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    );
    await inMemoryAnswersRepository.create(newAnswer);
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
      content: 'new content',
    });
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'new content',
    });
  });
  it('Should NOT edit an answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    );
    await inMemoryAnswersRepository.create(newAnswer);
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
      content: 'new content',
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
