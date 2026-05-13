const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

const db = {
    async read(file) {
        const filePath = path.join(DATA_DIR, `${file}.json`);
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading ${file}.json:`, error);
            return [];
        }
    },
    async write(file, data) {
        const filePath = path.join(DATA_DIR, `${file}.json`);
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error(`Error writing to ${file}.json:`, error);
            return false;
        }
    }
};

module.exports = db;
