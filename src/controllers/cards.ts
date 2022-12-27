import {Request, Response} from 'express';
import {AppRequest} from '../utils/utils';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((users) => res.send({data: users}))
  .catch(() => res.status(500).send({message: 'Произошла ошибка'}));

export const createCard = (req: AppRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user!._id;
  return Card.create({ name, link, owner })
    .then((card) => res.send({data: card}))
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
};

export const deleteCardById = async (req: AppRequest, res: Response) => {
  const { cardId } = req.params;
  const ownerId = req.user?._id;
  try {
    const cardToDelete = await Card.findById(cardId);
    if (cardToDelete?.owner.toString() !== ownerId) {
      throw new Error('Чужая карточка');
    }
    await Card.findByIdAndRemove(cardId);
    res.send({ data: cardToDelete });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send({ message: err.message ? err.message : 'Произошла ошибка' });
    }
  }
};

export const likeCard = (req: AppRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;
  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const dislikeCard = (req: AppRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;
  return Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
