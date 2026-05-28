export const buildPrompt = (
  question: string,
  chunks: any[]
) => {

  const context = chunks
    .map(
      (chunk, index) => `
      [Source ${index + 1}]
      Document ID: ${chunk.documentId}
      Chunk Index: ${chunk.chunkIndex}

      ${chunk.text}
      `
    )
    .join("\n\n");

  return `
You are an AI assistant.

Answer the user's question ONLY using
the provided context.

Rules:
- Do not invent information
- Do not use outside knowledge
- If answer is missing, say:
  "I could not find the answer in the provided documents."."
- Cite supporting sources using:
  [Source X]

Context:
${context}

Question:
${question}

Answer:
`;
};