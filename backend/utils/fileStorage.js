const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Read JSON file
 */
function readJSONFile(filename) {
  const filePath = path.join(dataDir, filename);
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

/**
 * Write JSON file
 */
function writeJSONFile(filename, data) {
  const filePath = path.join(dataDir, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

/**
 * Generate a unique long ID (UUID v4)
 */
function generateLongId() {
  const crypto = require('crypto');
  return crypto.randomUUID();
}

/**
 * Get next ID for a collection (for backward compatibility with numeric IDs)
 * For new items, use generateLongId() instead
 */
function getNextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => {
    // If item has numeric ID, use it; otherwise return 0
    const id = item.id;
    return typeof id === 'number' ? id : 0;
  })) + 1;
}

module.exports = {
  readJSONFile,
  writeJSONFile,
  getNextId,
  generateLongId,
  dataDir
};

