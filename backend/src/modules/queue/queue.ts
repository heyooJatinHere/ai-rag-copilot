import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const documentQueue = new Queue(
  "document-processing",
  {
    connection,
  }
);