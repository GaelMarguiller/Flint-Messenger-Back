import * as actionsUserController from '../../controllers/userController';
import { User } from '../../models/usersModel';

describe('UserController', () => {

    test('UserController#getUser', () => {
        const id = "1";
        const toto = new User({firstname: 'toto', lastname: 'tutu', email: 'titi@gmail'})
        console.log(actionsUserController.getUser(id, toto => {return toto}))
        console.log(toto)
        expect(actionsUserController.getUser(id, toto => {return toto})).toBe(toto);
    })
})
