export type JournalEntry = {
id: `${string}-${string}-${string}-${string}-${string}`;
date: Date;
source?: "whatsapp" | "pages";
tags?: string[];
content: string;
reflection?: string;
}
