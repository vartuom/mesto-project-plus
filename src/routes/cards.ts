import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import { createCardValParams, getCardValParams } from '../utils/utils';

const router = Router();
router.get('/', getCards);
router.post('/', celebrate({ body: createCardValParams }), createCard);
router.delete('/:cardId', celebrate({ params: getCardValParams }), deleteCardById);
router.put('/:cardId/likes', celebrate({ params: getCardValParams }), likeCard);
router.delete('/:cardId/likes', celebrate({ params: getCardValParams }), dislikeCard);

export default router;
