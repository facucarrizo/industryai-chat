import {genkit, type GenkitErrorCode, type GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export function isGenkitError(
  error: unknown,
  code?: GenkitErrorCode
): error is GenkitError {
  return (
    typeof error === 'object' &&
    error !== null &&
    '__isGenkitError' in error &&
    (code === undefined || (error as GenkitError).code === code)
  );
}
