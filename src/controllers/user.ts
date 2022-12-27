import { Request, Response } from 'express';
import User from '../models/user';
import { AppRequest } from '../utils/utils';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const getUsersById = (req: Request, res: Response) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, avatar, about } = req.body;
  return User.create({ name, avatar, about })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const updateUser = (req: AppRequest, res: Response) => {
  const { name, about } = req.body;
  const id = req.user!._id;
  return User.findByIdAndUpdate(id, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const updateAvatar = (req: AppRequest, res: Response) => {
  const { avatar } = req.body;
  const id = req.user!._id;
  return User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
