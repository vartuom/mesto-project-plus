import { Router } from 'express';
import { createUser, getUsers, getUsersById } from '../controllers/user';

const router = Router();
router.get('/', getUsers);
router.get('/:userId', getUsersById);
router.post('/', createUser);

export default router;
