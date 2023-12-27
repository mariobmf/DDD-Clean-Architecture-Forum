import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';
import { makeAnswer } from 'test/factories/make-answer.factory';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe('CommentOnAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    );
  });
  it('Should be able to comment on answer', async () => {
    const answer = makeAnswer();
    await inMemoryAnswersRepository.create(answer);

    const { answerComment } = await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
      content: 'Comment',
    });

    expect(answerComment.content).toEqual('Comment');
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Comment',
    );
  });
});
