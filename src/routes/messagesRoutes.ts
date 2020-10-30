import { Router } from 'express';
import DatabaseError from '../controllers/errors/databaseError';
import authenticationRequired from '../middlewares/authenticationRequired';
import { Message } from '../models/messagesModel';
import { IUser, User } from '../models/usersModel';
import { io } from '../socket';

const router = Router();

router.get('/', authenticationRequired, async (req, res) => {
  const connectedUser = req.user as IUser;

  try {
    const messages = await Message.find({
      $or: [
        // eslint-disable-next-line no-underscore-dangle
        { emitter: connectedUser._id },
        // eslint-disable-next-line no-underscore-dangle
        { targets: connectedUser._id },
      ],
    });

    return res.send(messages);
  } catch (err) {
    throw new DatabaseError(err);
  }
});

router.post('/', authenticationRequired, async (req, res) => {
  const connectedUser = req.user as IUser;

  const { content, conversationId, targets } = req.body;
  if (!content || !conversationId || !targets || targets.length === 0) {
    return res
      .status(400)
      .send(`Please ensure that your request contains : content, conversationId and targets.
       Also check that targets is not an empty array`);
  }

  const message = new Message({
    // eslint-disable-next-line no-underscore-dangle
    emitter: connectedUser._id,
    content,
    conversationId,
    targets,
    createdAt: new Date(),
  });

  try {
    const createdMessage = await message.save();
    res.send(createdMessage);

    createdMessage.targets
    // eslint-disable-next-line no-underscore-dangle
      .filter((targ) => targ !== connectedUser._id)
      .forEach(async (target) => {
        const user = await User.findById(target);
        if (!user) { return; }
        if (!user.socket) { return; }

        console.log('emitting [new-message] ----->');
        return io.to(user.socket).emit('new-message', { message: createdMessage });
      });
  } catch (err) {
    throw new DatabaseError(err);
  }
});

export default router;
