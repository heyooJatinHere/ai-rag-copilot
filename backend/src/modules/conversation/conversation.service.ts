import { prisma } from "../../lib/prisma";

export const createConversation =
    async (
        documentId: number
    ) => {

        return prisma.conversation.create({
            data: {
                documentId,
            },
        });
    };