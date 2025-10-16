const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './journal.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function isValidEntry(entry) {
  return (
    typeof entry.id === 'string' &&
    typeof entry.date === 'string' &&
    typeof entry.content === 'string' &&
    (entry.tags === undefined || Array.isArray(entry.tags)) &&
    (entry.reflection === undefined || typeof entry.reflection === 'string') &&
    (entry.source === undefined || typeof entry.source === 'string')
  );
}

let allValid = true;
data.forEach((entry, idx) => {
  if (!isValidEntry(entry)) {
    allValid = false;
    console.log(`Invalid entry at index ${idx}:`, entry);
  }
});

if (allValid) {
  console.log('All entries are valid!');
} else {
  console.log('Some entries are invalid. See above for details.');
}
