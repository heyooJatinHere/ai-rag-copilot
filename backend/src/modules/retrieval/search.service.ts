import { generateEmbedding }
    from "../../services/embedding/generateEmbedding";

import { getQdrantClient }
    from "../../lib/qdrant";

export const searchSimilarChunks =
    async (query: string, documentId: number) => {

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

                    filter: {
                        must: [
                            {
                                key: "documentId",
                                match: {
                                    value: documentId,
                                },
                            },
                        ],
                    },
                }
            );

        const filteredResults = results.filter(
            (result: { score: number; }) => result.score > 0.55
        )

        const uniqueChunks = new Map();

        for (const result of filteredResults) {

            const text =
                result.payload?.text;

            if (!text) {
                continue;
            }

            if (!uniqueChunks.has(text)) {

                uniqueChunks.set(text, {
                    score: result.score,

                    text,

                    documentId:
                        result.payload?.documentId,

                    chunkIndex:
                        result.payload?.chunkIndex,
                });
            }
        }

        return Array.from(
            uniqueChunks.values()
        );
    };