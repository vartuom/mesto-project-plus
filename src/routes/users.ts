import { Router } from 'express';
import {
  createUser, getUsers, getUsersById, updateUser, updateAvatar,
} from '../controllers/user';

const router = Router();
router.get('/', getUsers);
router.get('/:userId', getUsersById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
