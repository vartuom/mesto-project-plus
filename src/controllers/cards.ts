import { NextFunction, Request, Response } from 'express';
import { IAppRequest } from '../utils/utils';
import Card from '../models/card';
import NotFoundError from '../utils/appErrorsClasses/notFoundError';
import ForbiddenError from '../utils/appErrorsClasses/forbiddenError';
import ValidationError from '../utils/appErrorsClasses/validationError';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const createCard = async (req: IAppRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user!._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.send({ data: card });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'ValidationError':
          next(new ValidationError('Переданы некорректные данные при создании карточки.'));
          break;
        default:
          next(err);
      }
    }
  }
};

export const deleteCardById = async (req: IAppRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const ownerId = req.user?._id;
  try {
    // перед удалением карточки сначала проверяем права доступа
    let cardToDelete = await Card.findById(cardId);
    if (!cardToDelete) next(new NotFoundError('Передан несуществующий _id карточки.'));
    // если запрос приходит не от автора карточки, выкидваем ошибку ForbiddenError
    if (cardToDelete?.owner.toString() !== ownerId) next(new ForbiddenError('Отказано в доступе. Чужая карточка.'));
    cardToDelete = await Card.findByIdAndRemove(cardId);
    res.send({ data: cardToDelete });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Передан некорректный _id карточки.'));
          break;
        default:
          next(err);
      }
    }
  }
};

export const likeCard = async (req: IAppRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;
  try {
    // eslint-disable-next-line max-len
    const card = await Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true, runValidators: true });
    if (!card) next(new NotFoundError('Передан несуществующий _id карточки.'));
    res.send({ data: card });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Передан некорректный _id карточки.'));
          break;
        case 'ValidationError':
          next(new ValidationError('Переданы некорректные данные для постановки лайка.'));
          break;
        default:
          next(err);
      }
    }
  }
};

export const dislikeCard = async (req: IAppRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;
  try {
    // eslint-disable-next-line max-len
    const card = await Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true, runValidators: true });
    if (!card) next(new NotFoundError('Передан несуществующий _id карточки.'));
    res.send({ data: card });
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Передан некорректный _id карточки.'));
          break;
        case 'ValidationError':
          next(new ValidationError('Переданы некорректные данные для снятия лайка.'));
          break;
        default:
          next(err);
      }
    }
  }
};
