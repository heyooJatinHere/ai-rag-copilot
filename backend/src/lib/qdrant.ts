let qdrant: any;
const DEFAULT_COLLECTION_NAME = "documents";
const DEFAULT_VECTOR_SIZE = 768;

export const getQdrantClient = async () => {

  if (!qdrant) {

    const { QdrantClient } =
      await import("@qdrant/js-client-rest");

    qdrant = new QdrantClient({
      url: "http://localhost:6333",
    });
  }

  return qdrant;
};

export const ensureQdrantCollection = async (
  collectionName = DEFAULT_COLLECTION_NAME
) => {
  const client = await getQdrantClient();
  const result = await client.collectionExists(collectionName);

  if (!result.exists) {
    await client.createCollection(collectionName, {
      vectors: {
        size: DEFAULT_VECTOR_SIZE,
        distance: "Cosine",
      },
    });
  }

  return client;
};
