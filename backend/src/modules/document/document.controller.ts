import { Request, Response } from "express";
import { getDocuments } from "./document.service";
import { prisma } from "../../lib/prisma";

export const listDocuments = async (
    req: Request,
    res: Response
) => {

    const page =
        Number(req.query.page) || 1;

    const limit =
        Number(req.query.limit) || 10;

    const skip =
        (page - 1) * limit;

    const [documents, total] =
        await Promise.all([
            prisma.document.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.document.count(),
        ]);

    return res.json({
        documents,
        page,
        totalPages:
            Math.ceil(total / limit),
    });
};