// Import necessary Node.js modules
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// --- Configuration ---
// IMPORTANT: Place your WhatsApp .txt file in the 'source_whatsapp' folder.
// The script will look for a file named '_chat.txt' by default. Change if needed.
const sourceFile = path.join(process.cwd(), 'data/raw-data', 'journal_chat_30072025_to_15102025.txt');
const destinationFile = path.join(process.cwd(), 'whatsapp_journal.json');

/**
 * Parses the WhatsApp timestamp into a valid JavaScript Date object.
 * @param {string} timestamp - e.g., "2025-03-21, 5:26:07 AM"
 * @returns {Date}
 */
const parseTimestamp = (timestamp) => {
  // new Date() can reliably parse "YYYY-MM-DD HH:MM:SS AM/PM"
  const parsableDateString = timestamp.replace(',', '');
  return new Date(parsableDateString);
};

/**
 * Main function to process the WhatsApp chat file.
 */
async function processWhatsappChat() {
  console.log(`🚀 Starting to process WhatsApp chat from: ${sourceFile}`);

  try {
    const fileContent = await readFile(sourceFile, 'utf-8');
    const lines = fileContent.split('\n');
    const journalEntries = [];

    // Regex to detect the start of a new message line
    // It captures: 1. The timestamp, 2. The author, 3. The message content
    const messageStartRegex = /\[(\d{4}-\d{2}-\d{2}, \d{1,2}:\d{2}:\d{2}\s[AP]M)\] ([^:]+): (.*)/;

    let currentEntry = null;

    for (const line of lines) {
      const match = line.match(messageStartRegex);

      if (match) {
        // This line is the start of a new message.
        // If there was a previous entry being built, it's now complete.
        
        const [, timestamp, author, content] = match;

        currentEntry = {
          id: crypto.randomUUID(),
          date: parseTimestamp(timestamp),
          source: 'whatsapp',
          content: content.trim(),
        };
        journalEntries.push(currentEntry);

      } else if (currentEntry) {
        // This line is a continuation of the previous message.
        // Append it to the content of the last entry.
        const trimmedLine = line.trim();
        if (trimmedLine) { // Only add non-empty lines
            currentEntry.content += `\n${trimmedLine}`;
        }
      }
      // If a line doesn't match and there's no currentEntry, it's likely a header or system message, so we ignore it.
    }

    if (journalEntries.length === 0) {
      console.warn('⚠️ No messages were parsed. Check the file format and path.');
      return;
    }

    // Write the result to the destination JSON file
    await writeFile(destinationFile, JSON.stringify(journalEntries, null, 2), 'utf-8');

    console.log(`✅ Success! Processed ${journalEntries.length} messages.`);
    console.log(`✅ Data saved to: ${destinationFile}`);

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Error: Source file not found at ${sourceFile}`);
      console.error('Please make sure your WhatsApp export file is in the correct location.');
    } else {
      console.error('❌ An error occurred during processing:', error);
    }
  }
}

// Run the script
processWhatsappChat();