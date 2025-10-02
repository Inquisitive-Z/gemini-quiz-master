import { GoogleGenAI, Type } from '@google/genai';
import { Quiz, QuizSettings } from '../types';
import { DOCUMENT_TEXT } from './document';

export const generateQuiz = async (settings: QuizSettings): Promise<Quiz> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Based *only* on the following document about Artificial Intelligence, create a quiz.

    Document:
    ---
    ${DOCUMENT_TEXT}
    ---

    Quiz criteria:
    - Difficulty: ${settings.difficulty}
    - Number of questions: ${settings.numQuestions}

    For each question, provide:
    1. "questionText": The question itself, derived from the document content.
    2. "options": An array of 4 strings, where one is the correct answer. All options must be plausible and related to the document's content.
    3. "correctAnswer": The string that is the correct answer from the options.
    4. "explanation": A brief, one-sentence explanation of why the correct answer is right, referencing information from the document.

    Ensure all questions, answers, and explanations are strictly based on the provided document text.
    Return the output as a JSON object that conforms to the provided schema. Do not include any introductory text or markdown formatting.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ['questionText', 'options', 'correctAnswer', 'explanation'],
        },
      },
    },
  });

  try {
    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText);
    
    // Validate that the parsed data is an array
    if (!Array.isArray(quizData)) {
      throw new Error("API did not return a valid quiz array.");
    }
    
    return quizData;
  } catch (error) {
    console.error("Failed to parse quiz JSON:", response.text);
    throw new Error("The AI failed to generate a valid quiz. Please try again later.");
  }
};