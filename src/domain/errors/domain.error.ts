export class domainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'domainError';

    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, domainError);
    }
  }
}