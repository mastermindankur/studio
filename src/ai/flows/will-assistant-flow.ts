
'use server';
/**
 * @fileOverview An AI-powered assistant for answering questions about Will creation in India.
 *
 * - willAssistant - A function that handles the assistant interaction.
 * - WillAssistantInput - The input type for the willAssistant function.
 * - WillAssistantOutput - The return type for the willAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WillAssistantInputSchema = z.object({
  query: z.string().describe('The user query or question about Will creation in India.'),
});
export type WillAssistantInput = z.infer<typeof WillAssistantInputSchema>;

const WillAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user query.'),
});
export type WillAssistantOutput = z.infer<typeof WillAssistantOutputSchema>;

export async function willAssistant(input: WillAssistantInput): Promise<WillAssistantOutput> {
  return willAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'willAssistantPrompt',
  input: {schema: WillAssistantInputSchema},
  output: {schema: WillAssistantOutputSchema},
  prompt: `You are an AI assistant for IndiaWill, specializing in Indian Will creation.
Your goal is to answer user queries about creating a Will in India, explain the importance of Wills, clarify concepts related to Indian succession law, and guide users through the services offered by IndiaWill for online Will generation.
Focus on information relevant to Indian citizens and Indian law.

Respond to the following user query:
{{query}}

If the question is complex or requires specific legal advice beyond your capabilities, advise the user to consult with a legal professional or use IndiaWill's support channels.
Do not provide financial or investment advice.
Keep responses concise and easy to understand.
`,
});

const willAssistantFlow = ai.defineFlow(
  {
    name: 'willAssistantFlow',
    inputSchema: WillAssistantInputSchema,
    outputSchema: WillAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
