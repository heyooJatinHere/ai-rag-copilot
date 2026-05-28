import { generateEmbedding }
from "../../services/embedding/generateEmbedding";

import { getQdrantClient }
from "../../lib/qdrant";

export const searchSimilarChunks =
  async (query: string) => {

    const embedding =
      await generateEmbedding(query);

    const qdrant =
      await getQdrantClient();

    const results =
      await qdrant.search(
        "documents",
        {
          vector: embedding,
          limit: 5,
        }
      );

    return results;
};