import { Request } from 'express';

export interface IAppRequest extends Request {
  user?: {_id: String}
}

export interface AppError {
  statusCode: number,
  message: string
}
// eslint-disable-next-line no-useless-escape
export const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
