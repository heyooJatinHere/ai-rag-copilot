"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
// import DocumentViewer from "./document/DocumentViewer"
import { Document } from "@/types/documents";

import dynamic from "next/dynamic";
import ChatPanel from "./chat/ChatPanel";

const DocumentViewer = dynamic(
    () =>
        import(
            "./document/DocumentViewer"
        ),
    {
        ssr: false,
    }
);

type Props = {
    children: ReactNode;
};

export default function AppShell({
    children,
}: Props) {
    const [
        selectedDocument,
        setSelectedDocument,
    ] = useState<Document | null>(
        null
    );
    return (
        <div className="h-screen flex flex-col">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    onSelectDocument={
                        setSelectedDocument
                    }
                />
                <div className="w-[45%] border-r">

                    {selectedDocument && (
                        <DocumentViewer
                            fileUrl={
                                `http://localhost:5000/uploads/${selectedDocument.filePath}`
                            }
                        />
                    )}

                </div>

                <div className="flex-1">
                    <ChatPanel
                        document={
                            selectedDocument
                        }
                    />
                </div>

                {/* <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main> */}
            </div>
        </div>
    );
}