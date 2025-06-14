// LegalChatbot.ts
'use server';

/**
 * @fileOverview An AI-powered chatbot for answering basic legal questions and guiding users to appropriate legal services.
 *
 * - legalChatbot - A function that handles the chatbot interaction.
 * - LegalChatbotInput - The input type for the legalChatbot function.
 * - LegalChatbotOutput - The return type for the legalChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LegalChatbotInputSchema = z.object({
  query: z.string().describe('The user query or legal question.'),
});
export type LegalChatbotInput = z.infer<typeof LegalChatbotInputSchema>;

const LegalChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
});
export type LegalChatbotOutput = z.infer<typeof LegalChatbotOutputSchema>;

export async function legalChatbot(input: LegalChatbotInput): Promise<LegalChatbotOutput> {
  return legalChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'legalChatbotPrompt',
  input: {schema: LegalChatbotInputSchema},
  output: {schema: LegalChatbotOutputSchema},
  prompt: `You are a legal chatbot designed to answer basic legal questions and guide users to the appropriate legal services offered by the firm.

  Respond to the following user query:
  {{query}}

  If the question is outside your capabilities, direct the user to contact the firm for further assistance.
`,
});

const legalChatbotFlow = ai.defineFlow(
  {
    name: 'legalChatbotFlow',
    inputSchema: LegalChatbotInputSchema,
    outputSchema: LegalChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
