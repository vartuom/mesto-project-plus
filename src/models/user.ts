import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';
import { urlRegex } from '../utils/utils';
import AuthenticationError from '../utils/appErrorsClasses/authenticationError';

interface IUser {
  name: string,
  avatar: string,
  about: string,
  email: string,
  password: string,
}

interface UserModel extends mongoose.Model<IUser> {
  // eslint-disable-next-line max-len, no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url: string) => urlRegex.test(url),
      message: 'Передана некорректная ссылка.',
    },
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 200,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email: string) => isEmail(email),
      message: 'Передан некорректный email.',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) throw new AuthenticationError('Неправильные почта или пароль');
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new AuthenticationError('Неправильные почта или пароль');
  return user;
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
