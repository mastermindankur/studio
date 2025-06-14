
"use server";

import { legalChatbot, type LegalChatbotInput, type LegalChatbotOutput } from "@/ai/flows/legal-chatbot";
import { z } from "zod";

const ChatbotActionInputSchema = z.object({
  query: z.string().min(1, "Query cannot be empty.").max(500, "Query is too long."),
});

// Renamed to avoid conflict with the imported type/function from the AI flow
export async function कानूनीChatbotAction(input: LegalChatbotInput): Promise<LegalChatbotOutput> {
  const validatedInput = ChatbotActionInputSchema.safeParse(input);

  if (!validatedInput.success) {
    // This case should ideally be handled by client-side validation too
    // but good to have server-side check.
    console.error("Invalid input to कानूनीChatbotAction:", validatedInput.error.flatten().fieldErrors);
    return { response: "Invalid input provided. Please ensure your query is not empty and within reasonable length." };
  }
  
  try {
    // The legalChatbot function is already an async server function.
    // It expects LegalChatbotInput and returns LegalChatbotOutput.
    const result = await legalChatbot(validatedInput.data);
    return result;
  } catch (error) {
    console.error("Error in कानूनीChatbotAction:", error);
    // It's better to return a generic error message to the client
    // and log the detailed error on the server.
    return { response: "An unexpected error occurred while processing your request. Please try again later." };
  }
}
