import { Router } from 'express';
import {
  createUser, getUsers, getUsersById, updateUser, updateAvatar,
} from '../controllers/users';

const router = Router();
router.get('/', getUsers);
router.get('/:userId', getUsersById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
