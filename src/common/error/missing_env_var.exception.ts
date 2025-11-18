/**
 * Exception thrown when a required environment variable is missing
 */
export class MissingEnvVarException extends Error {
  constructor(variableName: string) {
    super(`Missing required environment variable: ${variableName}`);
    this.name = 'MissingEnvVarException';
  }
}
