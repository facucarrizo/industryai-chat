// src/ai/flows/generate-response.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating chatbot responses using a Gemini model when no FAQ match is found.
 *
 * - generateResponse - A function that generates a response using a Gemini model based on user input and a system prompt.
 * - GenerateResponseInput - The input type for the generateResponse function.
 * - GenerateResponseOutput - The return type for the generateResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to be processed.'),
  systemPrompt: z.string().describe('The industry-specific system prompt for the AI model.'),
});
export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseOutputSchema = z.object({
  response: z.string().describe('The generated response from the AI model.'),
});
export type GenerateResponseOutput = z.infer<typeof GenerateResponseOutputSchema>;

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  return generateResponseFlow(input);
}

const generateResponsePrompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  input: {schema: GenerateResponseInputSchema},
  output: {schema: GenerateResponseOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are a helpful assistant.\n\nSystem Instructions:\n{{systemPrompt}}\n\nUser says:\n{{userInput}}\n\nAssistant:`,
 // Incorporate the system prompt and user input into the prompt.
});

const generateResponseFlow = ai.defineFlow(
  {
    name: 'generateResponseFlow',
    inputSchema: GenerateResponseInputSchema,
    outputSchema: GenerateResponseOutputSchema,
  },
  async input => {
    const {output} = await generateResponsePrompt(input);
    return output!;
  }
);
