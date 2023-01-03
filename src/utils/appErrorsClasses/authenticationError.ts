import { UNAUTHORIZED_ERROR } from '../errorsConstants';

class AuthenticationError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}
export default AuthenticationError;
