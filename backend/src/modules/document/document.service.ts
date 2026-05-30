import { prisma } from "../../lib/prisma";

export const getDocuments = async () => {
    return prisma.document.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};