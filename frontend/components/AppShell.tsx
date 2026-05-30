"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type Props = {
    children: ReactNode;
};

export default function AppShell({
    children,
}: Props) {
    return (
        <div className="h-screen flex flex-col">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}