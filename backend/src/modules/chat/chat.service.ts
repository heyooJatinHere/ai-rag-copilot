import { GoogleGenAI }
    from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export const streamAnswer =
    async (prompt: string) => {

        return ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

    };