import { Router } from 'express';
import { createUser, getUsers, getUsersById } from '../controllers/user';

const router = Router();
router.get('/users', getUsers);
router.get('/users/:userId', getUsersById);
router.post('/users', createUser);

export default router;
