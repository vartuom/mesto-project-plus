import { Router } from 'express';
import {
  getUsers, getUsersById, updateUser, updateAvatar, getUserInfo,
} from '../controllers/users';

const router = Router();
router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', getUsersById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
