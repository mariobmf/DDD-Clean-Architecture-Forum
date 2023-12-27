import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface DeleteQuestionCommentRequest {
  authorId: string;
  questionCommentId: string;
}
interface DeleteQuestionCommentResponse {}

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}
  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentRequest): Promise<DeleteQuestionCommentResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId);
    if (!questionComment) throw new Error('Question comment not found');
    if (authorId !== questionComment.authorId.toString())
      throw new Error('Not allowed');
    await this.questionCommentsRepository.delete(questionComment);
    return {};
  }
}