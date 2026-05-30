"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Document } from "../types/documents";

type Props = {
    documents: Document[];
};

export default function DocumentList({
    documents,
}: Props) {
    const [isOpen, setIsOpen] =
        useState(true);

    return (
        <div>

            <button
                onClick={() =>
                    setIsOpen(!isOpen)
                }
                className="flex w-full items-center justify-between mb-3"
            >
                <div className="flex items-center gap-2">
                    {isOpen ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}

                    <h3 className="text-sm font-semibold text-[var(--muted)] uppercase">
                        Documents ({documents.length})
                    </h3>
                </div>
            </button>

            {isOpen && (
                <div className="space-y-1">

                    {documents.map((doc) => (

                        <div
                            key={doc.id}
                            className="rounded-md px-2 py-2 hover:bg-gray-50 cursor-pointer"
                        >

                            <div className="flex items-center gap-2">

                                <span
                                    className={`h-2 w-2 rounded-full ${doc.status === "COMPLETED"
                                        ? "bg-green-500"
                                        : doc.status === "PROCESSING"
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        }`}
                                />

                                <p className="truncate text-sm">
                                    {doc.filename}
                                </p>

                            </div>

                            <p className="ml-4 text-xs text-[var(--muted)]">
                                {new Date(
                                    doc.createdAt
                                ).toLocaleDateString()}
                            </p>

                        </div>

                    ))}

                </div>
            )}
        </div>
    );
}