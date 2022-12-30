import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { urlRegex } from '../utils/utils';

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
  },
});

export default mongoose.model('user', userSchema);
