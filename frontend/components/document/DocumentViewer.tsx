"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
    new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
    ).toString();

type Props = {
    fileUrl: string;
};

export default function DocumentViewer({
    fileUrl,
}: Props) {

    const [numPages, setNumPages] =
        useState<number>(0);

    const [pageNumber, setPageNumber] =
        useState<number>(1);

    return (
        <div className="flex h-full flex-col">

            <div className="border-b bg-white px-4 py-3">
                <h2 className="font-semibold">
                    Document Viewer
                </h2>
            </div>

            <div className="flex-1 overflow-auto bg-gray-100 p-4">

                <Document
                    file={fileUrl}
                    onLoadSuccess={({ numPages }) =>
                        setNumPages(numPages)
                    }
                >

                    {Array.from(
                        new Array(numPages),
                        (_, index) => (
                            <div
                                key={index}
                                className="mb-4 flex justify-center"
                            >
                                <Page
                                    pageNumber={
                                        index + 1
                                    }
                                    width={700}
                                />
                            </div>
                        )
                    )}

                </Document>

            </div>

        </div>
    );
}