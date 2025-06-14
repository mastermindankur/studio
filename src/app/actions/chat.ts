
"use server";

import { willAssistant, type WillAssistantInput, type WillAssistantOutput } from "@/ai/flows/will-assistant-flow";
import { z } from "zod";

const ChatbotActionInputSchema = z.object({
  query: z.string().min(1, "Query cannot be empty.").max(500, "Query is too long."),
});

export async function willAssistantAction(input: WillAssistantInput): Promise<WillAssistantOutput> {
  const validatedInput = ChatbotActionInputSchema.safeParse(input);

  if (!validatedInput.success) {
    console.error("Invalid input to willAssistantAction:", validatedInput.error.flatten().fieldErrors);
    return { response: "Invalid input provided. Please ensure your query is not empty and within reasonable length." };
  }
  
  try {
    const result = await willAssistant(validatedInput.data);
    return result;
  } catch (error) {
    console.error("Error in willAssistantAction:", error);
    return { response: "An unexpected error occurred while processing your request. Please try again later." };
  }
}
