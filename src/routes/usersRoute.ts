import { Request, Response, Router } from 'express';
import {
    createUser,
    deleteUser,
    getListUsers,
    getUser,
    updateUser
} from '../controllers/userController';
import {IUser} from "../models/usersModel";

const router = Router();

router.get('/', (req : Request, res : Response) => {
    getListUsers(users => {
        if(!users) return res.status(404).send('Users not found');
        return res.send(users);
    });
});

router.get('/:userId', (req : Request, res : Response) => {
    const id: string = req.params["userId"];

    getUser(id, user => {
        if(!user) return res.status(404).send('User not found');
        return res.send(user);
    });
});

router.post('/', (req : Request, res : Response) => {
    const {firstname, lastname, email} = req.body;

    createUser(firstname, lastname, email, (user: IUser[]) => {
        if (!firstname || !lastname || !email) {
            return res.status(400).send("Please provide a firstname, lastname and email");
        }
        return res.send(user)
    });
});

router.patch('/:userId', (req: Request, res: Response) => {
    const id = req.params["userId"];
    const { firstname, lastname, email } = req.body;

    updateUser(id, (user => {
        if(!id) return res.status(404).send('User not found');
        return res.send(user);
    }), firstname, lastname, email);
})

router.delete('/:userId', (req, res) => {
    const id: string = req.params["userId"];

    deleteUser(id, user => {
        if(!id) return res.status(404).send('User not found');
        return res.send(user);
    });
});
export default router;
