// Gemini AI API Service
// This service handles communication with Google's Gemini API

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface GeminiMessage {
  text: string;
  role?: 'user' | 'model';
}

/**
 * Send a message to Gemini API and get a response
 */
export async function sendMessageToGemini(
  message: string,
  conversationHistory: GeminiMessage[] = []
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  try {
    // Prepare conversation history
    const contents = conversationHistory.map(msg => ({
      parts: [{ text: msg.text }],
      role: msg.role || 'user'
    }));

    // Add current message
    contents.push({
      parts: [{ text: message }],
      role: 'user'
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    // Extract the response text
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('Unexpected response format from Gemini API');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

/**
 * Generate a wellness-focused response from Gemini
 * This adds context about Ria being a wellness assistant
 */
export async function getWellnessResponse(
  userMessage: string,
  conversationHistory: GeminiMessage[] = []
): Promise<string> {
  const wellnessContext = `You are Ria, a friendly and supportive AI wellness assistant. Your role is to help users with:
- Health and wellness guidance
- Mood and emotional support
- Exercise and fitness advice
- Nutrition and meal planning
- Habit building and breaking
- Stress management and relaxation techniques

Be warm, empathetic, and encouraging. Keep responses concise but helpful. If the user asks about something outside wellness, gently redirect to wellness topics or offer to help with wellness-related aspects.

User message: ${userMessage}`;

  return sendMessageToGemini(wellnessContext, conversationHistory);
}

