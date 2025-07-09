import { google } from 'googleapis';
import { defineFlow } from '@genkit-ai/flow';
import { z } from 'genkit';

const FetchFAQInputSchema = z.object({
  message: z.string().describe("User's question"),
  sheetId: z.string().describe("The ID of the Google Sheet"),
  sheetTab: z.string().describe("The tab name inside the Sheet"),
});

const FetchFAQOutputSchema = z.object({
  answer: z.string().describe("Matching answer from FAQ sheet or empty"),
});

export const fetchFaqResponse = defineFlow({
  name: 'fetchFaqResponse',
  inputSchema: FetchFAQInputSchema,
  outputSchema: FetchFAQOutputSchema,
  run: async ({ message, sheetId, sheetTab }) => {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetTab}!A2:B`,
    });

    const rows = res.data.values || [];

    for (const [question, answer] of rows) {
      if (message.toLowerCase().includes(question.toLowerCase())) {
        return { answer };
      }
    }

    return { answer: "" };
  },
});
