"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function UploadBox() {
    const [file, setFile] =
        useState<File | null>(null);

    const [uploading, setUploading] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [error, setError] =
        useState("");

    const handleUpload = async () => {
        if (!file) return;

        try {
            setUploading(true);
            setError("");
            setSuccess("");

            const formData =
                new FormData();

            formData.append("file", file);

            const response =
                await api.post(
                    "/upload",
                    formData
                );

            setSuccess(
                `Uploaded successfully`
            );

            window.dispatchEvent(
                new CustomEvent(
                    "document-uploaded",
                    {
                        detail: response.data,
                    }
                )
            );

            setFile(null);

        } catch (error) {

            console.error(error);

            setError(
                "Upload failed"
            );

        } finally {

            setUploading(false);

        }
    };

    return (
        <div className="rounded-xl border bg-white p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Upload PDF
            </h2>

            <label
                htmlFor="file-upload"
                className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)] p-8 transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
            >
                <div className="text-center">

                    <p className="text-lg font-medium">
                        Drop PDF here
                    </p>

                    <p className="mt-2 text-sm text-[var(--muted)]">
                        or click to browse
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                        PDF files only
                    </p>

                </div>

                <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) =>
                        setFile(
                            e.target.files?.[0] ?? null
                        )
                    }
                />
            </label>

            {file && (
                <div className="mt-4 rounded-lg border border-[var(--border)] p-3">

                    <p className="truncate text-sm font-medium">
                        {file.name}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                        {(file.size / 1024 / 1024).toFixed(2)}
                        {" MB"}
                    </p>

                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="mt-4 w-full rounded-lg bg-[var(--accent)] px-4 py-3 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
            >
                {uploading
                    ? "Uploading..."
                    : "Upload Document"}
            </button>

            {success && (
                <p className="mt-4 text-green-600">
                    {success}
                </p>
            )}

            {error && (
                <p className="mt-4 text-red-600">
                    {error}
                </p>
            )}

        </div>
    );
}