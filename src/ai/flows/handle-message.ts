'use server';

/**
 * @fileOverview This file defines the main Genkit flow for handling user messages.
 *
 * - handleMessage - Orchestrates the chatbot's response by checking FAQs, detecting lead intent, and generating a response.
 * - HandleMessageInput - The input type for the handleMessage function.
 * - HandleMessageOutput - The return type for the handleMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generateResponse} from './generate-response';
import {detectLeadIntent} from './detect-lead-intent';
import {fetchFaqResponse} from './fetch-faq-response';

const HandleMessageInputSchema = z.object({
  message: z.string(),
  sheetId: z.string(),
  sheetTab: z.string(),
  systemPrompt: z.string(),
});
export type HandleMessageInput = z.infer<typeof HandleMessageInputSchema>;

const HandleMessageOutputSchema = z.object({
  reply: z.string(),
  isLead: z.boolean(),
  reason: z.string(),
});
export type HandleMessageOutput = z.infer<typeof HandleMessageOutputSchema>;

export async function handleMessage(input: HandleMessageInput): Promise<HandleMessageOutput> {
  return handleMessageFlow(input);
}

export const handleMessageFlow = ai.defineFlow(
  {
    name: 'handleMessageFlow',
    inputSchema: HandleMessageInputSchema,
    outputSchema: HandleMessageOutputSchema,
  },
  async (input) => {
    const { message, sheetId, sheetTab, systemPrompt } = input;
    
    // 1. Search for response in FAQs
    const faqResult = await fetchFaqResponse({ message, sheetId, sheetTab });
    
    let reply = faqResult.answer;

    if (!reply) {
      const genResponse = await generateResponse({ userInput: message, systemPrompt });
      reply = genResponse.response;
    }

    // 2. Lead detection
    const { isLead, reason } = await detectLeadIntent({ message });

    // 3. (Optional) Save to Firestore if it's a lead
    if (isLead) {
      // You can save using admin.firestore() if you have it imported
    }

    return { reply, isLead, reason };
  },
);
