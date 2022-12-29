import { Request } from 'express';

export interface AppRequest extends Request {
  user?: {_id: String}
}

export interface AppError {
  statusCode: number,
  message: string
}
