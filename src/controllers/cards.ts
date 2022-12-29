import { NextFunction, Request, Response } from 'express';
import { AppRequest } from '../utils/utils';
import Card from '../models/card';
import NotFoundError from '../utils/appErrorsClasses/notFoundError';
import ForbiddenError from '../utils/appErrorsClasses/forbiddenError';
import ValidationError from '../utils/appErrorsClasses/validationError';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const createCard = async (req: AppRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user!._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.send({ data: card });
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

export const deleteCardById = async (req: AppRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const ownerId = req.user?._id;
  try {
    const cardToDelete = await Card.findById(cardId);
    if (!cardToDelete) next(new NotFoundError('Карточка не найдена'));
    if (cardToDelete?.owner.toString() !== ownerId) next(new ForbiddenError('Отказано в доступе. Чужая карточка'));
    await Card.findByIdAndRemove(cardId);
    res.send({ data: cardToDelete });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Карточка не найдена'));
          break;
        default:
          next(err);
      }
    }
  }
};

export const likeCard = async (req: AppRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;
  try {
    const card = await Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true });
    if (!card) next(new NotFoundError('Карточка не найдена'));
    res.send({ data: card });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Карточка не найдена'));
          break;
        default:
          next(err);
      }
    }
  }
};

export const dislikeCard = async (req: AppRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;
  try {
    const card = await Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true });
    if (!card) next(new NotFoundError('Карточка не найдена'));
    res.send({ data: card });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Карточка не найдена'));
          break;
        default:
          next(err);
      }
    }
  }
};
