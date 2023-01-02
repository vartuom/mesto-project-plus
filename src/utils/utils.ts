import { Request } from 'express';
import { Joi } from 'celebrate';

export interface IAppRequest extends Request {
  user?: {_id: String}
}

export interface AppError {
  statusCode: number,
  message: string
}
// eslint-disable-next-line no-useless-escape
export const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export const getUserValParams = Joi.object().keys({
  userId: Joi.string().length(24).hex(),
});

export const createUserValParams = Joi.object().keys({
  name: Joi.string().min(2).max(30),
  avatar: Joi.string().pattern(urlRegex),
  about: Joi.string().min(2).max(200),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(5),

});

export const updateUserValParams = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  about: Joi.string().required().min(2).max(200),
});

export const loginValParams = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(5),
});

export const updateAvatarValParams = Joi.object().keys({
  avatar: Joi.string().required().pattern(urlRegex),
});

export const getCardValParams = Joi.object().keys({
  cardId: Joi.string().length(24).hex(),
});

export const createCardValParams = Joi.object().keys({
  name: Joi.string().min(2).max(30),
  link: Joi.string().required().pattern(urlRegex),
});
