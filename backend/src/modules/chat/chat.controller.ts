import { Request, Response }
    from "express";

import { searchSimilarChunks }
    from "../retrieval/search.service";

import { buildPrompt }
    from "./promptBuilder";

import { streamAnswer } from "./chat.service";

export const chat =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const { question } = req.body;

            if (!question) {
                return res.status(400).json({
                    message: "Question required",
                });
            }

            const chunks =
                await searchSimilarChunks(question);

            if (chunks.length === 0) {

                return res.json({
                    answer:
                        "I could not find relevant information.",
                });
            }

            const prompt =
                buildPrompt(question, chunks);

            res.setHeader(
                "Content-Type",
                "text/event-stream"
            );

            res.setHeader(
                "Cache-Control",
                "no-cache"
            );

            res.setHeader(
                "Connection",
                "keep-alive"
            );

            const stream =
                await streamAnswer(prompt);

            for await (
                const chunk of stream
            ) {

                const text =
                    chunk.text;

                if (text) {

                    res.write(
                        `data: ${JSON.stringify({
                            text,
                        })}\n\n`
                    );
                }
            }
            res.write(
                `data: ${JSON.stringify({
                    done: true,
                    sources: chunks.map(
                        (chunk, index) => ({
                            source: index + 1,
                            documentId:
                                chunk.documentId,
                            chunkIndex:
                                chunk.chunkIndex,
                        })
                    ),
                })}\n\n`
            );

            res.end();

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Internal server error",
            });
        }
    };

