import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getUsers, getUsersById, updateUser, updateAvatar, getUserInfo,
} from '../controllers/users';
import { getUserValParams, updateAvatarValParams, updateUserValParams } from '../utils/utils';

const router = Router();
router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', celebrate({ params: getUserValParams }), getUsersById);
router.patch('/me', celebrate({ body: updateUserValParams }), updateUser);
router.patch('/me/avatar', celebrate({ body: updateAvatarValParams }), updateAvatar);

export default router;
