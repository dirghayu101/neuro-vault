import { JournalEntry } from "./types"

export const Entries = [
    {
        id: crypto.randomUUID(),
        date: new Date("2023-02-26"),
        source: "pages",
        content: `your content comes here..`,
        tags: ["angry", "if you have any"],
        reflection: `if you have any`

    }

] as const satisfies JournalEntry[];
