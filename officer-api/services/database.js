const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
async function openConnection(){
    const db = await open({filename: process.env.DB_PATH,driver: sqlite3.Database});
    db.run('PRAGMA foreign_keys = ON;');
    return db
}
module.exports = openConnection