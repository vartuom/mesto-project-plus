import { VALIDATION_ERROR } from '../errorsConstants';

class ValidationError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = VALIDATION_ERROR;
  }
}
export default ValidationError;
