export const chunkText = (
  text: string,
  chunkSize = 800,
  overlap = 150
) => {

  const chunks: string[] = [];

  const paragraphs = text
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  let currentChunk = "";

  const pushChunk = (
    value: string
  ) => {

    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    chunks.push(trimmed);

    currentChunk =
      trimmed.slice(-overlap);
  };

  for (const paragraph of paragraphs) {

    const nextChunk =
      currentChunk
        ? `${currentChunk}\n${paragraph}`
        : paragraph;

    if (
      nextChunk.length > chunkSize
    ) {

      pushChunk(currentChunk);

      currentChunk = paragraph;

      if (
        paragraph.length > chunkSize
      ) {

        for (
          let i = 0;
          i < paragraph.length;
          i += chunkSize - overlap
        ) {

          const slice =
            paragraph.slice(
              i,
              i + chunkSize
            );

          pushChunk(slice);
        }

        currentChunk = "";
      }

      continue;
    }

    currentChunk = nextChunk;
  }

  pushChunk(currentChunk);

  return chunks;
};