export default function Header() {
    return (
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">
                AI RAG Copilot
            </h1>

            <div className="text-sm text-gray-500">
                Local Development
            </div>
        </header>
    );
}