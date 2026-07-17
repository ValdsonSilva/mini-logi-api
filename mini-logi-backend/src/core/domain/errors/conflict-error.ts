import { AppError } from './app-error.js';

export class ConflictError extends AppError {
    constructor(message: string, code = 'RESOURCE_CONFLICT') {
        super(message, 409, code);
    }
}