import * as actionsUserController from '../../controllers/userController';
import { User } from '../../models/usersModel';

describe('UserController', () => {
  test('UserController#getUser', () => {
    const id = '1';
    const toto = new User({
      firstname: 'toto',
      lastname: 'tutu',
      email: 'titi@gmail',
    });
    expect(actionsUserController.getUser(id, (tutu) => tutu)).toBe(toto);
  });
});
