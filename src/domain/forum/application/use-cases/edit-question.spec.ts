import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { EditQuestionUseCase } from './edit-question';
import { makeQuestion } from 'test/factories/make-question.factory';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed.error';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment.factory';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe('Edit question use case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    );
  });
  it('Should edit an question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    );
    await inMemoryQuestionsRepository.create(newQuestion);
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );
    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      content: 'new content',
      title: 'new title',
      attachmentsIds: ['1', '3'],
    });
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      content: 'new content',
      title: 'new title',
    });
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ]);
  });
  it('Should NOT edit an question from another user', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    );
    await inMemoryQuestionsRepository.create(newQuestion);
    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
      content: 'new content',
      title: 'new title',
      attachmentsIds: [],
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
