// src/ai/flows/detect-lead-intent.ts
'use server';

/**
 * @fileOverview Detects lead intent from user input.
 *
 * - detectLeadIntent - A function that determines if a user message indicates lead intent.
 * - DetectLeadIntentInput - The input type for the detectLeadIntent function.
 * - DetectLeadIntentOutp - The return type for the detectLeadIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectLeadIntentInputSchema = z.object({
  message: z
    .string()
    .describe('The user message to analyze for lead intent.'),
});
export type DetectLeadIntentInput = z.infer<typeof DetectLeadIntentInputSchema>;

const DetectLeadIntentOutputSchema = z.object({
  isLead: z
    .boolean()
    .describe('Whether the user message indicates lead intent.'),
  reason: z
    .string()
    .describe('The reason for the lead intent detection.'),
});
export type DetectLeadIntentOutput = z.infer<typeof DetectLeadIntentOutputSchema>;

export async function detectLeadIntent(input: DetectLeadIntentInput): Promise<DetectLeadIntentOutput> {
  return detectLeadIntentFlow(input);
}

const detectLeadIntentPrompt = ai.definePrompt({
  name: 'detectLeadIntentPrompt',
  input: {schema: DetectLeadIntentInputSchema},
  output: {schema: DetectLeadIntentOutputSchema},
  prompt: `You are an AI assistant designed to detect lead intent from user messages in a chatbot.

  Analyze the following message to determine if the user is expressing interest in a service or product.

  Message: {{{message}}}

  Respond with a JSON object indicating whether the message indicates lead intent (isLead: boolean) and the reason for your determination (reason: string).
  If it is determined to be a lead, extract the potential product or service of interest from the message.
  If you are unsure, default isLead to false.
  `,
});

const detectLeadIntentFlow = ai.defineFlow(
  {
    name: 'detectLeadIntentFlow',
    inputSchema: DetectLeadIntentInputSchema,
    outputSchema: DetectLeadIntentOutputSchema,
  },
  async input => {
    const {output} = await detectLeadIntentPrompt(input);
    return output!;
  }
);


