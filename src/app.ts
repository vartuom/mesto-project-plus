import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { celebrate } from 'celebrate';
import {AppError, createUserValParams, IAppRequest, loginValParams} from './utils/utils';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { DEFAULT_ERROR } from './utils/errorsConstants';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';


const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger); // подключаем логер запросов

app.post('/signup', celebrate({ params: createUserValParams }), createUser);
app.post('/signin', celebrate({ params: loginValParams }), login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

// Централизованная обработка ошибок
// eslint-disable-next-line no-unused-vars
app.use((err: AppError, req: IAppRequest, res: Response, next: NextFunction) => {
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
