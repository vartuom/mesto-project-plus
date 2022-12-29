import mongoose from 'mongoose';
import { urlRegex } from '../utils/utils';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (url: string) => urlRegex.test(url),
      message: 'Передана некорректная ссылка.',
    },
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
});

export default mongoose.model('user', userSchema);
