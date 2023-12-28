import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { EditAnswerUseCase } from './edit-answer';
import { makeAnswer } from 'test/factories/make-answer.factory';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed.error';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment.factory';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit answer use case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    );
  });
  it('Should edit an answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    );
    await inMemoryAnswersRepository.create(newAnswer);
    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
      content: 'new content',
      attachmentsIds: ['1', '3'],
    });
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'new content',
    });
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      ],
    );
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
      attachmentsIds: [],
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
