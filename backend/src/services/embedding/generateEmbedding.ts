let aiClientPromise: Promise<{
  models: {
    embedContent: (params: {
      model: string;
      contents: string;
      config?: {
        outputDimensionality?: number;
      };
    }) => Promise<{
      embeddings?: Array<{
        values?: number[];
      }>;
    }>;
  };
}> | null = null;

const getAiClient = async () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  if (!aiClientPromise) {
    aiClientPromise = import("@google/genai").then(({ GoogleGenAI }) => {
      return new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY!,
      });
    });
  }

  return aiClientPromise;
};

export const generateEmbedding = async (text: string) => {
  const ai = await getAiClient();
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding?.length) {
    throw new Error("Embedding generation returned no vector values");
  }

  return embedding;
};
