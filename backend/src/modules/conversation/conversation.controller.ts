import { Request, Response }
    from "express";

import {
    createConversation,
} from "./conversation.service";

export const create =
    async (
        req: Request,
        res: Response
    ) => {

        const {
            documentId,
        } = req.body;

        if (!documentId) {
            return res.status(400).json({
                message:
                    "documentId required",
            });
        }

        const conversation =
            await createConversation(
                Number(documentId)
            );

        return res.json(
            conversation
        );
    };