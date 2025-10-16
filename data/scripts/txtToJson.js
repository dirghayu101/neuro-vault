// Import necessary Node.js modules
import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// --- Configuration ---
// IMPORTANT: Change these paths to match your directories.
const sourceDirectory = path.join(process.cwd(), 'data/raw-data/letters'); // The folder with your .txt files
const destinationFile = path.join(process.cwd(), 'data/cleaned-data/pageJournal2.json'); // The output JSON file

/**
 * Parses a date string in "ddmmyyyy" format into a Date object.
 * @param {string} dateStr - The date string, e.g., "26012023".
 * @returns {Date} A Date object.
 */
const parseDateFromFilename = (dateStr) => {
    if(dateStr.length != 8){
        return null
    }
  const day = dateStr.substring(0, 2);
  const month = dateStr.substring(2, 4); // JavaScript months are 0-indexed (0-11)
  const year = dateStr.substring(4, 8);
  // Using YYYY-MM-DD format is the most reliable way to instantiate a new Date
  return new Date(`${year}-${month}-${day}`);
};

/**
 * Main function to process the journal files.
 */
async function processJournalFiles() {
  console.log(`Starting to process files from: ${sourceDirectory}`);

  try {
    // 1. Get all filenames from the source directory
    const allFiles = await readdir(sourceDirectory);
    const txtFiles = allFiles.filter(file => path.extname(file).toLowerCase() === '.txt');

    if (txtFiles.length === 0) {
      console.log('No .txt files found in the source directory.');
      return;
    }

    console.log(`Found ${txtFiles.length} text files to process.`);

    // 2. Process each file and create a journal entry object
    const journalEntriesPromises = txtFiles.map(async (filename) => {
      const filePath = path.join(sourceDirectory, filename);
      const parts = filename.replace(/\.txt$/, '').split('_');

      // Ensure the filename has the expected format (e.g., id_date_title)
      if (parts.length < 3) {
        console.warn(`- Skipping file with unexpected format: ${filename}`);
        return null;
      }
      
      const dateString = parts[1];
      const date = parseDateFromFilename(dateString)
      const title = parts.slice(2).join('_'); // Re-join in case title has underscores
      const content = await readFile(filePath, 'utf-8');


      if(date === null){
        console.warn(`- Skipping file with unexpected format: ${filename}`);
        return null;
      }

      return {
        id: crypto.randomUUID(),
        date: date,
        source: 'pages',
        title: title,
        content: content.trim(),
        tags: [], 
        reflection: '',
      };
    });

    // Wait for all file processing to complete
    const journalEntries = (await Promise.all(journalEntriesPromises))
      .filter(entry => entry !== null); // Filter out any skipped files

    // 3. Write the array of objects to the destination JSON file
    // The 'null, 2' argument formats the JSON file with an indentation of 2 spaces for readability
    await writeFile(destinationFile, JSON.stringify(journalEntries, null, 2));

    console.log(`✅ Success! All entries have been processed and saved to: ${destinationFile}`);

  } catch (error) {
    console.error('❌ An error occurred during processing:', error);
  }
}

// Run the script
processJournalFiles();