import UserNotFoundError from '../../../controllers/errors/userNotFoundError';

describe('UserNotFoundError controller', () => {
  test('UserNotFoundError', () => {
    const id = '1';
    const message = 'Not found';
    const testUserNotFoundError = new UserNotFoundError(id, message);

    expect(typeof id).toEqual('number');
    expect(typeof message).toEqual('string');
    expect(new UserNotFoundError('2', 'Not found')).toEqual(
      testUserNotFoundError,
    );
  });
});
