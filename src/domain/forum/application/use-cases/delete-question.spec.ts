import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { DeleteQuestionUseCase } from './delete-question';
import { makeQuestion } from 'test/factories/make-question.factory';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed.error';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment.factory';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe('Delete question use case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });
  it('Should delete an question', async () => {
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
    });
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0);
  });
  it('Should NOT delete an question from another user', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    );
    await inMemoryQuestionsRepository.create(newQuestion);
    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
