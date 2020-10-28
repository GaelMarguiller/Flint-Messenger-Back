import { Request, Response, Router } from 'express';
import {
  createUser,
  deleteUser,
  getListUsers,
  getUser,
  updateUser,
  updateConversationSeen,
} from '../controllers/userController';
import { IUser } from '../models/usersModel';
import authenticationRequired from '../middlewares/authenticationRequired';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  getListUsers().then((users: IUser[]) => res.send(
    users.map((user: IUser) => user.getSafeUser()),
  ));
});

router.get('/me', authenticationRequired, (req, res) => res.send((req.user as IUser).getSafeUser()));

router.get('/:userId', (req: Request, res: Response) => {
  const id: string = req.params.userId;

  getUser(id, (user) => {
    if (!user) return res.status(404).send('User not found');
    return res.send(user);
  });
});

router.post('/', (req : Request, res : Response) => {
  const {
    firstname, lastname, email, password,
  } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).send('Please provide a firstname, lastname and email');
  }
  const newUser = createUser(firstname, lastname, email, password);

  return res.send(newUser.getSafeUser());
});

router.patch('/conversation-seen', authenticationRequired, async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { conversationId } = req.body;

  if (!conversationId) { return res.sendStatus(400); }

  const updatedUser = await updateConversationSeen(user, conversationId);

  return res.send(updatedUser.getSafeUser());
});

router.patch('/:userId', authenticationRequired, (req: Request, res: Response) => {
  const id = req.params.userId;
  const { firstname, lastname, email } = req.body;

  updateUser(
    id,
    (user) => {
      if (!id) return res.status(404).send('User not found');
      return res.send(user);
    },
    firstname,
    lastname,
    email,
  );
});

router.delete('/:userId', (req, res) => {
  const id: string = req.params.userId;

  deleteUser(id, (user) => {
    if (!id) return res.status(404).send('User not found');
    return res.send(user);
  });
});
export default router;
