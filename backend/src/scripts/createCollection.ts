import { getQdrantClient } from "../lib/qdrant";

async function main() {

  const qdrant=await getQdrantClient()
  await qdrant.createCollection(
    "documents",
    {
      vectors: {
        size: 768, //Vector size MUST match embedding model dimensions.
        distance: "Cosine",
      },
    }
  );

  console.log("Collection created");
}

main();