export const chunkText = (
  text: string,
  chunkSize = 800
) => {
  const chunks: string[] = [];
  const paragraphs = text
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  let currentChunk = "";

  const pushChunk = (value: string) => {
    const trimmed = value.trim();
    if (trimmed) {
      chunks.push(trimmed);
    }
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > chunkSize) {
      pushChunk(currentChunk);
      currentChunk = "";

      for (let i = 0; i < paragraph.length; i += chunkSize) {
        pushChunk(paragraph.slice(i, i + chunkSize));
      }
      continue;
    }

    const nextChunk = currentChunk
      ? `${currentChunk}\n${paragraph}`
      : paragraph;

    if (nextChunk.length > chunkSize) {
      pushChunk(currentChunk);
      currentChunk = paragraph;
      continue;
    }

    currentChunk = nextChunk;
  }

  pushChunk(currentChunk);

  return chunks;
};