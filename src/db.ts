import sqlite3 from 'better-sqlite3';
import logger from './logger';

const db = sqlite3('./indira.db');
db.pragma('journal_mode = WAL');

type THistory = {
  id: string;
  session_id: string;
  question: string;
  response: string;
  created_at: string;
  updated_at: string;
}

async function createTables() {
  try {
    // Create database
    const tables = db.exec(`CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      question TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    logger.info('Tables created:', tables);
  } catch (error) {
    logger.error('Error creating tables:', error);
    process.exit(1);
  }
}

async function getHistory(sessionID: string): Promise<THistory[] | undefined> {
  try {
    const history = db.prepare('SELECT * FROM history WHERE session_id = ?').all(sessionID) as THistory[];

    return history;
  } catch (error) {
    logger.error('Error getting history:', error);
    return undefined
  }
}

async function addHistory(sessionID: string, data: { question: string, response: string }): Promise<sqlite3.RunResult | undefined> {
  try {
    const { question, response } = data;
    const history = db.prepare('INSERT INTO history (session_id, question, response) VALUES (?, ?, ?)').run(sessionID, question, response);
    return history
  } catch (error) {
    logger.error('Error adding history:', error);
    return undefined
  }
}

async function deleteOldestHistory(sessionID: string): Promise<sqlite3.RunResult | undefined> {
  try {
    const history = db.prepare('DELETE FROM history WHERE session_id = ? ORDER BY created_at ASC LIMIT 1').run(sessionID);
    return history
  } catch (error) {
    logger.error('Error deleting oldest history:', error);
    return undefined
  }
}

export default {
  createTables,
  getHistory,
  addHistory,
  deleteOldestHistory
}

export type {
  THistory
}