import { executeSql } from "./database";

export const createTables = async () => {
  await executeSql(`
    CREATE TABLE IF NOT EXISTS sentence_frames (
      id INTEGER PRIMARY KEY,
      key TEXT,
      template TEXT,
      is_question INTEGER
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS frame_slots (
      id INTEGER PRIMARY KEY,
      frame_id INTEGER,
      slot_key TEXT
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS vocabulary (
      id INTEGER PRIMARY KEY,
      language TEXT,
      text TEXT
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS slot_vocabulary (
      slot_id INTEGER,
      vocab_id INTEGER
    );
  `);
};
