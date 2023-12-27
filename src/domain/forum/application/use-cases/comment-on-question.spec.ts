import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository';
import { CommentOnQuestionUseCase } from './comment-on-question';
import { makeQuestion } from 'test/factories/make-question.factory';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe('CommentOnQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });
  it('Should be able to comment on question', async () => {
    const question = makeQuestion();
    await inMemoryQuestionsRepository.create(question);

    const { questionComment } = await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: 'Comment',
    });

    expect(questionComment.content).toEqual('Comment');
    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Comment',
    );
  });
});