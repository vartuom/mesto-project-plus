import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { AppRequest } from '../utils/utils';
import NotFoundError from "../utils/appErrorsClasses/notFoundError";
import ValidationError from "../utils/appErrorsClasses/validationError";

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUsersById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) next(new NotFoundError('Запрашиваемый пользователь не найден'));
    res.send({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Запрашиваемый пользователь не найден'));
          break;
        default:
          next(err);
      }
    }
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, avatar, about } = req.body;
  try {
    const user = await User.create({ name, avatar, about });
    res.send({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'ValidationError':
          next(new ValidationError('Ошибка валидации переданных данных.'));
          break;
        default:
          next(err);
      }
    }
  }
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
