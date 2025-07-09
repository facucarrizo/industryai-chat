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
  prompt:` You are an AI assistant designed to detect lead intent from user messages in a chatbot.
  
  Your task is to decide if the user is expressing commercial interest in a service or product.
  
  Message: "{{message}}"
  
  Return only a JSON object in this format:
  {
    "isLead": true or false,
    "reason": "Brief explanation for your classification."
  }
  
  If you're unsure, return:
  {
    "isLead": false,
    "reason": "No clear intent detected."
  }`,  
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


