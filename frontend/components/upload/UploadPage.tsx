"use client";

import UploadBox from "./UploadBox";
import RecentDocuments from "./RecentDocuments";

export default function UploadPage() {
    return (
        <div className="mx-auto max-w-4xl">

            <h1 className="mb-6 text-3xl font-bold">
                Upload Documents
            </h1>

            <UploadBox />

            {/* <div className="mt-8">
                <RecentDocuments />
            </div> */}

        </div>
    );
}