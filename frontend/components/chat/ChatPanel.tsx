"use client";

import { useState } from "react";
import { Document } from "@/types/documents";

type Props = {
    document: Document | null;
};

type Message = {
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
};

type Source = {
    documentId: number;
    chunkIndex: number;
};

export default function ChatPanel({
    document,
}: Props) {

    const [question, setQuestion] =
        useState("");

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [
        conversationId,
        setConversationId,
    ] = useState<number | null>(
        null
    );

    const handleSend = async () => {

        if (
            !question.trim() ||
            !document
        ) {
            return;
        }

        const userQuestion =
            question;

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content:
                    userQuestion,
            },
        ]);

        setQuestion("");

        setLoading(true);

        try {
            let currentConversationId =
                conversationId;

            if (
                !currentConversationId
            ) {

                const conversationResponse =
                    await fetch(
                        "http://localhost:5000/conversations",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body: JSON.stringify({
                                documentId:
                                    document.id,
                            }),
                        }
                    );

                const conversation =
                    await conversationResponse.json();

                currentConversationId =
                    conversation.id;

                setConversationId(
                    conversation.id
                );
            }

            const response =
                await fetch(
                    "http://localhost:5000/chat",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            question:
                                userQuestion,

                            documentId:
                                document.id,

                            conversationId:
                                currentConversationId,
                        }),
                    }
                );

            const reader =
                response.body?.getReader();

            if (!reader) {
                return;
            }

            let assistantText =
                "";

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "",
                },
            ]);

            const decoder =
                new TextDecoder();

            while (true) {

                const {
                    done,
                    value,
                } =
                    await reader.read();

                if (done) {
                    break;
                }

                const chunk =
                    decoder.decode(
                        value
                    );

                const lines =
                    chunk
                        .split("\n")
                        .filter(
                            (line) =>
                                line.startsWith(
                                    "data:"
                                )
                        );

                for (const line of lines) {

                    const payload =
                        JSON.parse(
                            line.replace(
                                "data:",
                                ""
                            )
                        );

                    if (
                        payload.text
                    ) {

                        assistantText +=
                            payload.text;

                        setMessages(
                            (
                                prev
                            ) => {

                                const copy =
                                    [
                                        ...prev,
                                    ];

                                copy[
                                    copy.length -
                                    1
                                ] = {
                                    role:
                                        "assistant",

                                    content:
                                        assistantText,
                                };

                                return copy;
                            }
                        );
                    }
                }
            }

        } catch (error) {

            console.error(
                error
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="flex h-full flex-col">

            <div className="border-b p-4">

                <h2 className="font-semibold">
                    Chat
                </h2>

                {document && (
                    <p className="mt-1 text-xs text-gray-500 truncate">
                        {document.filename}
                    </p>
                )}

            </div>

            <div className="flex-1 overflow-y-auto p-4">

                <div className="space-y-4">

                    {messages.map(
                        (message, index) => (

                            <div
                                key={index}
                                className={
                                    message.role === "user"
                                        ? "ml-auto max-w-[80%] rounded-lg bg-blue-100 p-3"
                                        : "max-w-[80%] rounded-lg bg-gray-100 p-3"
                                }
                            >
                                {message.content}
                            </div>

                        )
                    )}

                </div>

            </div>

            <div className="border-t p-4">

                <textarea
                    disabled={!document}
                    value={question}
                    onChange={(e) =>
                        setQuestion(e.target.value)
                    }
                    className="w-full rounded border p-2"
                    placeholder={
                        document
                            ? "Ask about this document..."
                            : "Select a document first"
                    }
                />

                <button
                    onClick={handleSend}
                    disabled={
                        !document ||
                        loading
                    }
                    className="mt-2 rounded bg-black px-4 py-2 text-white"
                >
                    {loading
                        ? "Thinking..."
                        : "Send"}
                </button>

            </div>

        </div>
    );
}