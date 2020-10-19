import { Router } from 'express';
import passport from 'passport';
import UserNotFoundError from '../controllers/errors/userNotFoundError';

const router = Router();

router.post('/', (req, res) => {
  const authenticationFunction = passport.authenticate('local', (err, user) => {
    if (err) {
      if (err instanceof UserNotFoundError) return res.status(404).send('User not found');
      return res.status(500).send();
    }

    if (user) {
      return req.logIn(user, (error) => {
        if (error) return res.status(500).send();
        return res.send(user.getSafeUser());
      });
    }
    return res.status(404).send('User not found');
  });

  return authenticationFunction(req, res);
});

export default router;
