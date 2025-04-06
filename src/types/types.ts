export type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

export type ChatConfig = {
    model: string;
    maxTokens: number;
    temperature: number;
    systemPrompt: string;
};