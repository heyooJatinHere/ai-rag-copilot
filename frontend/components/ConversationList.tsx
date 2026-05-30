"use client";

type Conversation = {
    id: string;
    title: string;
};

type Props = {
    conversations: Conversation[];
};

export default function ConversationList({
    conversations,
}: Props) {
    return (
        <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase">
                Conversations
            </h3>

            <div className="space-y-2">
                {conversations.map((chat) => (
                    <div
                        key={chat.id}
                        className="rounded-lg border p-3 cursor-pointer hover:bg-gray-50"
                    >
                        {chat.title}
                    </div>
                ))}
            </div>
        </div>
    );
}