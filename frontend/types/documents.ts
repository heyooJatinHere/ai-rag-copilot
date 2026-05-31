export type Document = {
    id: string;
    filename: string;
    filePath: string;
    status:
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";
    createdAt: string;
};