import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import {AppError, AppRequest} from './utils/utils';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

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

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Централизованная обработка ошибок
app.use((err: AppError, req: AppRequest, res: Response, next: NextFunction) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
