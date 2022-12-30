import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { AppRequest } from '../utils/utils';
import NotFoundError from '../utils/appErrorsClasses/notFoundError';
import ValidationError from '../utils/appErrorsClasses/validationError';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUsersById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) next(new NotFoundError('Пользователь по указанному _id не найден.'));
    res.send({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Передан некорректный _id пользователя.'));
          break;
        default:
          next(err);
      }
    }
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    avatar,
    about,
    email,
    password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      about,
      email,
      password: hash,
    });
    res.send({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'ValidationError':
          next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
          break;
        default:
          if (err.message.includes('duplicate key error')) next(new ValidationError('Пользователь с переданным email уже существует.'));
          next(err);
      }
    }
  }
};

export const updateUser = async (req: AppRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const id = req.user!._id;
  try {
    // eslint-disable-next-line max-len
    const user = await User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true });
    if (!user) next(new NotFoundError('Пользователь по указанному _id не найден.'));
    res.send({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Передан некорректный _id пользователя.'));
          break;
        case 'ValidationError':
          next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
          break;
        default:
          next(err);
      }
    }
  }
};

export const updateAvatar = async (req: AppRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const id = req.user!._id;
  try {
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true });
    if (!user) next(new NotFoundError('Пользователь по указанному _id не найден.'));
    res.send({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Передан некорректный _id пользователя.'));
          break;
        case 'ValidationError':
          next(new ValidationError('Переданы некорректные данные при обновлении аватара.'));
          break;
        default:
          next(err);
      }
    }
  }
};
