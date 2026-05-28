"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = void 0;
const prisma_1 = require("../../lib/prisma");
const uploadDocument = async (file) => {
    const document = await prisma_1.prisma.document.create({
        data: {
            filename: file.originalname,
            status: "PROCESSING",
        },
    });
    return {
        documentId: document.id,
    };
};
exports.uploadDocument = uploadDocument;
//# sourceMappingURL=upload.service.js.map