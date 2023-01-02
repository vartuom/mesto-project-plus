import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError, AppRequest } from './utils/utils';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { DEFAULT_ERROR } from './utils/errorsConstants';
import e from "express";
import {createUser, login} from "./controllers/users";

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use((req: AppRequest, res: Response, next) => {
  req.user = {
    // _id: '5d8b8592978f8bd833ca8133',
    _id: '63aaf91dfd661cea0baa1b93',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');
app.post('/signup', createUser);
app.post('/signin', login);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Централизованная обработка ошибок
// eslint-disable-next-line no-unused-vars
app.use((err: AppError, req: AppRequest, res: Response, next: NextFunction) => {
  console.log(err);
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = DEFAULT_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === DEFAULT_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
