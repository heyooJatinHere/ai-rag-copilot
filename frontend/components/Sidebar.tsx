"use client";

import DocumentList from "./DocumentList";
import ConversationList from "./ConversationList";
import { Document } from "@/types/documents";
import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import Link from "next/link";

type Props = {
    onSelectDocument: (
        document: Document
    ) => void;
};

export default function Sidebar({
    onSelectDocument,
}: Props) {
    const [documents, setDocuments] =
        useState<Document[]>([]);

    const [initialLoading, setInitialLoading] =
        useState(true);

    const [loadingMore, setLoadingMore] =
        useState(false);

    const [page, setPage] =
        useState(1);

    const [hasMore, setHasMore] =
        useState(true);

    const conversations = [
        {
            id: "1",
            title: "What is entrepreneurship?",
        },
    ];

    useEffect(() => {
        const loadInitialDocuments =
            async () => {
                try {
                    const response =
                        await api.get(
                            "/documents?page=1&limit=8"
                        );

                    setDocuments(
                        response.data.documents
                    );
                } finally {
                    setInitialLoading(false);
                }
            };

        loadInitialDocuments();
    }, []);

    const fetchDocuments = useCallback(
        async (
            pageNumber: number,
            reset = false
        ) => {
            try {
                if (pageNumber > 1) {
                    setLoadingMore(true);
                }

                const response =
                    await api.get(
                        `/documents?page=${pageNumber}&limit=8`
                    );

                const newDocuments =
                    response.data.documents;

                if (
                    newDocuments.length === 0
                ) {
                    setHasMore(false);
                    return;
                }

                if (
                    reset ||
                    pageNumber === 1
                ) {
                    setDocuments(
                        newDocuments
                    );
                } else {
                    setDocuments((prev) => [
                        ...prev,
                        ...newDocuments,
                    ]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingMore(false);
            }
        },
        []
    );

    useEffect(() => {

        if (page === 1) {
            return;
        }

        fetchDocuments(page);

    }, [page, fetchDocuments]);

    const pollDocuments = async () => {
        try {
            const response = await api.get(
                "/documents?page=1&limit=8"
            );

            const latestDocuments =
                response.data.documents;

            setDocuments((prev) =>
                prev.map((doc) => {
                    const updated =
                        latestDocuments.find(
                            (d: Document) =>
                                d.id === doc.id
                        );

                    return updated ?? doc;
                })
            );
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        const hasProcessingDocuments =
            documents.some(
                (doc) =>
                    doc.status === "PROCESSING"
            );

        if (!hasProcessingDocuments) {
            return;
        }

        const interval = setInterval(() => {
            pollDocuments();
        }, 3000);

        return () =>
            clearInterval(interval);

    }, [documents, fetchDocuments]);

    useEffect(() => {
        const handleUpload = async () => {
            try {
                const response =
                    await api.get(
                        "/documents?page=1&limit=8"
                    );

                setDocuments(
                    response.data.documents
                );
            } catch (error) {
                console.error(error);
            }
        };

        window.addEventListener(
            "document-uploaded",
            handleUpload
        );

        return () => {
            window.removeEventListener(
                "document-uploaded",
                handleUpload
            );
        };
    }, []);

    const handleDocumentScroll = (
        e: React.UIEvent<HTMLDivElement>
    ) => {
        const target =
            e.currentTarget;

        const reachedBottom =
            target.scrollTop +
            target.clientHeight >=
            target.scrollHeight - 50;

        if (
            reachedBottom &&
            hasMore &&
            !loadingMore
        ) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <aside className="w-72 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col">
            <div className="p-4 border-b border-[var(--border)]">
                <Link
                    href="/upload"
                    className="block w-full rounded-lg bg-[var(--accent)] text-black py-2 text-center font-medium"
                >
                    Upload Document
                </Link>
            </div>

            <div className="h-[35vh] border-b border-[var(--border)] flex flex-col">
                {initialLoading ? (
                    <div className="p-4 text-sm">
                        Loading documents...
                    </div>
                ) : (
                    <div
                        className="flex-1 overflow-y-auto"
                        onScroll={
                            handleDocumentScroll
                        }
                    >
                        <div className="sticky top-0 z-10 bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3">
                            <h3 className="text-sm font-semibold uppercase">
                                Documents
                            </h3>
                        </div>

                        <div className="p-2">
                            <DocumentList
                                documents={documents}
                                onSelect={
                                    onSelectDocument
                                }
                            />
                        </div>

                        {loadingMore && (
                            <div className="py-2 text-center text-xs text-[var(--muted)]">
                                Loading more...
                            </div>
                        )}

                        {!hasMore &&
                            documents.length >
                            0 && (
                                <div className="py-2 text-center text-xs text-[var(--muted)]">
                                    No more documents
                                </div>
                            )}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <ConversationList
                    conversations={
                        conversations
                    }
                />
            </div>
        </aside>
    );
}