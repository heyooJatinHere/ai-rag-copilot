export type Document = {
    id: string;
    filename: string;
    status:
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";
    createdAt: string;
};