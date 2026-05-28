"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = void 0;
const prisma_1 = require("../../lib/prisma");
const queue_1 = require("../queues/queue");
const uploadDocument = async (file) => {
    const document = await prisma_1.prisma.document.create({
        data: {
            filename: file.originalname,
            status: "PROCESSING",
        },
    });
    await queue_1.documentQueue.add("process-document", {
        documentId: document.id,
        filePath: file.path,
    });
    return {
        documentId: document.id,
        status: document.status,
    };
};
exports.uploadDocument = uploadDocument;
//# sourceMappingURL=upload.service.js.map