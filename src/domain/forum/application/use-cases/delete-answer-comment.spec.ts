import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository';
import { makeAnswerComment } from 'test/factories/make-answer-comment.factory';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe('DeleteAnswerCommentsUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });
  it('Should delete an answer comment', async () => {
    const answerComment = makeAnswerComment();
    await inMemoryAnswerCommentsRepository.create(answerComment);
    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });
  it('Should NOT delete an answer comments from another user', async () => {
    const answerComment = makeAnswerComment();
    await inMemoryAnswerCommentsRepository.create(answerComment);
    expect(() =>
      sut.execute({
        answerCommentId: answerComment.id.toString(),
        authorId: 'OTHER_AUTHOR_ID',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
