


type ChatPageProps = {
  searchParams?: Promise<{
    documentId?: string;
    documentName?: string;
  }>;
};

export default async function ChatPage({
  searchParams,
}: ChatPageProps) {
  const params = await searchParams;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="absolute left-[6%] top-10 h-44 w-44 rounded-full bg-[var(--accent-soft)] blur-3xl" />
      <div className="absolute right-[10%] top-16 h-56 w-56 rounded-full bg-[var(--accent-2-soft)] blur-3xl" />
      {/* <ChatWindow documentName={params?.documentName} /> */}
    </main>
  );
}
