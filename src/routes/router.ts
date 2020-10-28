import { Router } from 'express';
import usersRoutes from './usersRoute';
import loginRoutes from './loginRoutes';
import messagesRoutes from './messagesRoutes';

const router = Router();

router.use('/users', usersRoutes);
router.use('/login', loginRoutes);
router.use('/messages', messagesRoutes);

export default router;
