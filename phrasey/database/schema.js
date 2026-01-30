import { executeSql } from "./database";

export const createTables = async () => {
  await executeSql(`
    CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY,
      code TEXT UNIQUE,
      name TEXT,
      nativeName TEXT
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      key TEXT,
      displayName TEXT,
      icon TEXT
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS intents (
      id INTEGER PRIMARY KEY,
      key TEXT,
      description TEXT
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS sentence_frames (
      id INTEGER PRIMARY KEY,
      intentId INTEGER,
      language TEXT,
      template TEXT,
      pronunciation TEXT,
      translation TEXT
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS frame_breakdown (
      id INTEGER,
      frameId INTEGER,
      text TEXT,
      meaning TEXT,
      slotKey TEXT
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS vocabulary (
      id INTEGER PRIMARY KEY,
      categoryId INTEGER,
      language TEXT,
      slotKey TEXT,
      text TEXT,
      pronunciation TEXT,
      englishMeaning TEXT
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS frame_slots (
      id INTEGER PRIMARY KEY,
      intentId INTEGER,
      slotKey TEXT
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS slot_vocabulary (
      slotId INTEGER,
      vocabId INTEGER
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS categoryIntents (
      categoryId INTEGER,
      intentId INTEGER
    );
  `);
};