import { Either, left, right } from './either';

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(1);
  } else {
    return left('error');
  }
}

describe('Either', () => {
  it('should return success', () => {
    const result = doSomething(true);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
  });
  it('should return error', () => {
    const result = doSomething(false);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
  });
});
