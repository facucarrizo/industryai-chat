import { defineFlow } from '@genkit-ai/flow';
import { z } from 'genkit';
import { generateResponse } from './generate-response';
import { detectLeadIntent } from './detect-lead-intents';
import { fetchFaqResponse } from './fetch-faq-response';

const HandleMessageInputSchema = z.object({
  message: z.string(),
  sessionId: z.string(),
  sheetId: z.string(),
  sheetTab: z.string(),
  systemPrompt: z.string(),
  industry: z.string(),
});

export const handleMessage = defineFlow({
  name: 'handleMessage',
  inputSchema: HandleMessageInputSchema,
  outputSchema: z.object({
    reply: z.string(),
    isLead: z.boolean(),
    reason: z.string(),
  }),
  run: async ({ message, sessionId, sheetId, sheetTab, systemPrompt, industry }) => {
    // 1. Buscar respuesta en FAQs
    const faqResult = await fetchFaqResponse({ message, sheetId, sheetTab });
    const reply = faqResult.answer || (await generateResponse({ userInput: message, systemPrompt })).response;

    // 2. Detección de lead
    const { isLead, reason } = await detectLeadIntent({ message });

    // 3. (Opcional) Guardar en Firestore si es lead
    if (isLead) {
      // Podés guardar usando admin.firestore() si lo tenés importado
    }

    return { reply, isLead, reason };
  },
});
