import { Request, Response } from 'express';
import User from '../models/user';
import { AppRequest } from '../utils/utils';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const getUsersById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {

    } throw new Error('Запрашиваемый пользователь не найден');
    res.send({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'CastError':
          res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
          break;
        default:
          res.status(500).send({ message: err.message ? err.message : 'Произошла ошибка' });
      }
    }
  }
};

export const createUser = (req: Request, res: Response) => {
  const { name, avatar, about } = req.body;
  return User.create({ name, avatar, about })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const updateUser = async (req: AppRequest, res: Response) => {
  const { name, about } = req.body;
  const id = req.user!._id;
  try {
    const user = await User.findByIdAndUpdate(id, { name, about }, { new: true });
    // if (!user) throw new Error('Запрашиваемый пользователь не найден');
    res.send({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.message) {
        case 'CastError':
          res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
          break;
        default:
          res.status(500).send({ message: err.message ? err.message : 'Произошла ошибка' });
      }
    }
  }
};

export const updateAvatar = async (req: AppRequest, res: Response) => {
  const { avatar } = req.body;
  const id = req.user!._id;
  try {
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true });
    // if (!user) throw new Error('Запрашиваемый пользователь не найден');
    res.send({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.message) {
        case 'CastError':
          res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
          break;
        default:
          res.status(500).send({ message: err.message ? err.message : 'Произошла ошибка' });
      }
    }
  }
};
