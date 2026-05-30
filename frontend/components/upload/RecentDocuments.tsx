"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type {
    Document,
} from "../../types/documents";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function RecentDocuments() {

    const [
        documents,
        setDocuments,
    ] = useState<Document[]>(
        []
    );

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] =
        useState(1);


    // const totalPages = Math.ceil(
    //     documents.length / ITEMS_PER_PAGE
    // );


    useEffect(() => {

        const fetchDocuments = async () => {

            try {

                const response =
                    await api.get(
                        `/documents?page=${page}&limit=5`
                    );

                setDocuments(
                    response.data.documents
                );

                setTotalPages(
                    response.data.totalPages
                );

            } catch (error) {

                console.error(error);

            }

        };

        fetchDocuments();

    }, [page]);

    return (
        <div>

            <h2 className="mb-4 text-xl font-semibold">
                Recent Uploads
            </h2>

            <div className="space-y-3">

                {documents.map(
                    (document) => (
                        <div
                            key={document.id}
                            className="rounded-md border px-3 py-2 hover:bg-gray-50"
                        >
                            <div className="flex items-center justify-between">
                                <p className="truncate text-sm font-medium">
                                    {document.filename}
                                </p>

                                <span
                                    className={`h-2 w-2 rounded-full ${document.status === "COMPLETED"
                                        ? "bg-green-500"
                                        : document.status === "PROCESSING"
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        }`}
                                />
                            </div>

                            <div className="mt-1 flex items-center justify-between text-xs text-[var(--muted)]">
                                <span>{document.status}</span>

                                <span>
                                    {new Date(
                                        document.createdAt
                                    ).toISOString()}
                                </span>
                            </div>
                        </div>
                    )
                )}
                <div className="mt-6 flex items-center justify-center gap-4">

                    <button
                        onClick={() =>
                            setPage((prev) =>
                                Math.max(prev - 1, 1)
                            )
                        }
                        disabled={page === 1}
                        className="disabled:opacity-40"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <span className="text-sm font-medium">
                        {page} of {Math.max(totalPages, 1)}
                    </span>

                    <button
                        onClick={() =>
                            setPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={
                            page === totalPages ||
                            totalPages === 0
                        }
                        className="disabled:opacity-40"
                    >
                        <ChevronRight size={18} />
                    </button>

                </div>

            </div>

        </div>
    );
}