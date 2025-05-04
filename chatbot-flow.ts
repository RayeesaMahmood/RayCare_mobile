
'use server';
/**
 * @fileOverview Basic chatbot flow using Genkit.
 *
 * - chatbotRespond - A function that takes user input and returns a bot response.
 * - ChatbotInput - The input type for the chatbotRespond function.
 * - ChatbotOutput - The return type for the chatbotRespond function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const ChatbotInputSchema = z.object({
  userMessage: z.string().describe('The message input by the user.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  reply: z.string().describe('The chatbot\'s response to the user message.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;


// Exported wrapper function
export async function chatbotRespond(input: ChatbotInput): Promise<ChatbotOutput> {
  // In a more complex scenario, you might add logic here before calling the flow
  // e.g., check user authentication, fetch user-specific context, etc.
  return chatbotFlow(input);
}


// Define the prompt
const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {
    schema: ChatbotInputSchema,
  },
  output: {
    schema: ChatbotOutputSchema,
  },
  prompt: `You are a helpful AI assistant for RayCare Queue, a hospital queue management system.
  Your goal is to assist users with their queries regarding the hospital services, appointments, and queue status.
  Be concise and helpful.

  Keep your responses brief and directly answer the user's question.

  Contextual Information:
  - Emergency: If the user mentions an emergency, direct them to use the dedicated "Emergency" button on the app for immediate assistance.
  - Appointments: Users can book appointments through the RayCare website/app in the 'Book Appointment' section. They can select departments and doctors there.
  - Departments: Available departments include Cardiology, Orthopedics, Pediatrics, etc.
  - Doctors: Specific doctors like Dr. Smith, Dr. Jones, Dr. Wilson are available (availability might vary).
  - Queue Tracking: Users can track their queue position and estimated wait time in the 'Track Queue' section using their queue number (e.g., Q-123).
  - Medicine/Prescriptions: Advise users to consult with a doctor for prescriptions or medical advice. Do not provide medical advice yourself.

  User Message: {{{userMessage}}}

  Generate a helpful and concise reply based on the user's message and the provided context.`,
});

// Define the flow
const chatbotFlow = ai.defineFlow<
  typeof ChatbotInputSchema,
  typeof ChatbotOutputSchema
>(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await chatbotPrompt(input);
    // Ensure output is not null before returning
    return output ?? { reply: "Sorry, I couldn't generate a response." };
  }
);

// Note: No need to explicitly export chatbotPrompt or chatbotFlow
// The exported wrapper function `chatbotRespond` is the public interface.
