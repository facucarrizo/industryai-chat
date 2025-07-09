'use server';

/**
 * @fileOverview Fetches FAQ responses from a Google Sheet.
 *
 * - fetchFaqResponse - A function that matches a user's question to a FAQ.
 * - FetchFaqResponseInput - The input type for the fetchFaqResponse function.
 * - FetchFaqResponseOutput - The return type for the fetchFaqResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {google} from 'googleapis';

const FetchFaqResponseInputSchema = z.object({
  message: z.string().describe("User's question"),
  sheetId: z.string().describe('The ID of the Google Sheet'),
  sheetTab: z.string().describe('The tab name inside the Sheet'),
});
export type FetchFaqResponseInput = z.infer<
  typeof FetchFaqResponseInputSchema
>;

const FetchFaqResponseOutputSchema = z.object({
  answer: z.string().describe('Matching answer from FAQ sheet or empty'),
});
export type FetchFaqResponseOutput = z.infer<
  typeof FetchFaqResponseOutputSchema
>;

export async function fetchFaqResponse(
  input: FetchFaqResponseInput
): Promise<FetchFaqResponseOutput> {
  return fetchFaqResponseFlow(input);
}

export const fetchFaqResponseFlow = ai.defineFlow(
  {
    name: 'fetchFaqResponseFlow',
    inputSchema: FetchFaqResponseInputSchema,
    outputSchema: FetchFaqResponseOutputSchema,
  },
  async ({message, sheetId, sheetTab}) => {
    try {
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      const sheets = google.sheets({version: 'v4', auth});
      
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${sheetTab}!A2:B`,
      });

      const rows = res.data.values || [];

      for (const row of rows) {
        const question = row[0] || '';
        const answer = row[1] || '';
        if (
          question &&
          answer &&
          message.toLowerCase().includes(question.toLowerCase())
        ) {
          return {answer};
        }
      }

      return {answer: ''};
    } catch (error) {
      console.error('Error fetching FAQ from Google Sheet:', error);
      // Return empty answer in case of error to allow fallback to generative response.
      return {answer: ''};
    }
  }
);
