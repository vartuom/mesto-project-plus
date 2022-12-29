import { FORBIDDEN_ERROR } from '../errorsConstants';

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}
export default ForbiddenError;
