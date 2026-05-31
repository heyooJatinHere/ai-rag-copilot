import { Request, Response }
    from "express";

import { searchSimilarChunks }
    from "../retrieval/search.service";

import { buildPrompt }
    from "./promptBuilder";

import { streamAnswer } from "./chat.service";
import { prisma } from "../../lib/prisma";

export const chat =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                question,
                documentId,
                conversationId,
            } = req.body;

            if (!question || !documentId) {
                return res.status(400).json({
                    message:
                        "Question and documentId required",
                });
            }

            if (conversationId) {

                await prisma.message.create({
                    data: {
                        conversationId,
                        role: "user",
                        content: question,
                    },
                });

            }

            const chunks =
                await searchSimilarChunks(question, documentId);

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

            let fullAnswer = "";

            const stream =
                await streamAnswer(prompt);

            for await (
                const chunk of stream
            ) {

                const text =
                    chunk.text;

                if (text) {
                    fullAnswer += text;
                    res.write(
                        `data: ${JSON.stringify({
                            text,
                        })}\n\n`
                    );
                }
            }

            if (conversationId) {

                await prisma.message.create({
                    data: {
                        conversationId,
                        role: "assistant",
                        content: fullAnswer,
                    },
                });

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

