"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const connection = new ioredis_1.default({
    host: "redis",
    port: 6379,
    maxRetriesPerRequest: null,
});
exports.documentQueue = new bullmq_1.Queue("document-processing", {
    connection,
});
//# sourceMappingURL=queue.js.map