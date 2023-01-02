import { CONFLICT_ERROR } from '../errorsConstants';

class ConflictError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}
export default ConflictError;

