import seed from "../data/seed/seed.json";
import { executeSql } from "./database";

export const seedDatabase = async () => {
  // sentence frames
  for (const frame of seed.sentence_frames) {
    await executeSql(
      `INSERT OR IGNORE INTO sentence_frames (id, key, template, is_question)
       VALUES (?, ?, ?, ?)`,
      [frame.id, frame.key, frame.template, frame.is_question ? 1 : 0]
    );
  }

  // frame slots
  for (const slot of seed.frame_slots) {
    await executeSql(
      `INSERT OR IGNORE INTO frame_slots (id, frame_id, slot_key)
       VALUES (?, ?, ?)`,
      [slot.id, slot.frame_id, slot.slot_key]
    );
  }

  // vocabulary
  for (const vocab of seed.vocabulary) {
    await executeSql(
      `INSERT OR IGNORE INTO vocabulary (id, language, text)
       VALUES (?, ?, ?)`,
      [vocab.id, vocab.language, vocab.text]
    );
  }

  // slot ↔ vocab mapping
  for (const map of seed.slot_vocabulary) {
    await executeSql(
      `INSERT OR IGNORE INTO slot_vocabulary (slot_id, vocab_id)
       VALUES (?, ?)`,
      [map.slot_id, map.vocab_id]
    );
  }
};
