import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { EditQuestionUseCase } from './edit-question';
import { makeQuestion } from 'test/factories/make-question.factory';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe('Edit question use case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });
  it('Should edit an question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    );
    await inMemoryQuestionsRepository.create(newQuestion);
    const { question } = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      content: 'new content',
      title: 'new title',
    });
    expect(question).toMatchObject({
      content: 'new content',
      title: 'new title',
    });
    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      content: 'new content',
      title: 'new title',
    });
  });
  it('Should NOT edit an question from another user', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    );
    await inMemoryQuestionsRepository.create(newQuestion);
    expect(() =>
      sut.execute({
        questionId: 'question-1',
        authorId: 'author-2',
        content: 'new content',
        title: 'new title',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
