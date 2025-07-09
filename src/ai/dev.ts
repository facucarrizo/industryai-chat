import { config } from 'dotenv';
config();

// This file is used for local development with `npm run genkit:dev`.
// It imports all the flows so they are available to the Genkit developer UI.
import '@/ai/flows/generate-response.ts';
import '@/ai/flows/detect-lead-intent.ts';
import '@/ai/flows/fetch-faq-response.ts';
import '@/ai/flows/handle-message.ts';
