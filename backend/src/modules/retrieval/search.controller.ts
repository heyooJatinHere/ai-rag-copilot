import { Request, Response }
    from "express";

import { searchSimilarChunks }
    from "./search.service";

export const search =
    async (
        req: Request,
        res: Response
    ) => {

        const query =
            req.query.q as string;

        if (!query) {
            return res.status(400).json({
                message: "Query is required",
            });
        }

        const results =
            await searchSimilarChunks(query);

        return res.json(results);
    };