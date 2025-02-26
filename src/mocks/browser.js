import { setupWorker } from 'msw';
import { handlers } from './handlers';

// Set up the worker to intercept requests and use handlers
export const worker = setupWorker(...handlers);
