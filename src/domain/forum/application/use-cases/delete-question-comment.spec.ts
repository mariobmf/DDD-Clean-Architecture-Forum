import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository';
import { makeQuestionComment } from 'test/factories/make-question-comment.factory';
import { NotAllowedError } from './errors/not-allowed.error';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('DeleteQuestionCommentsUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });
  it('Should delete an question comment', async () => {
    const questionComment = makeQuestionComment();
    await inMemoryQuestionCommentsRepository.create(questionComment);
    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });
  it('Should NOT delete an question comments from another user', async () => {
    const questionComment = makeQuestionComment();
    await inMemoryQuestionCommentsRepository.create(questionComment);
    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'OTHER_AUTHOR_ID',
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
