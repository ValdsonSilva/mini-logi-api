import { AppError } from './app-error.js';

export class DomainValidationError extends AppError {
    constructor(message: string, code = 'DOMAIN_VALIDATION_ERROR') {
        super(message, 422, code);
    }
}