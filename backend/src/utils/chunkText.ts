export const chunkText = (
  text: string,
  chunkSize = 800
) => {

  const paragraphs =
    text.split("\n");

  const chunks: string[] = [];

  let currentChunk = "";

  for (const para of paragraphs) {

    if (
      (currentChunk + para).length >
      chunkSize
    ) {

      chunks.push(currentChunk);

      currentChunk = para;

    } else {

      currentChunk += "\n" + para;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};