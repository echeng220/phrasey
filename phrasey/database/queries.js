import { executeSql } from "./database";

export const getFrameWithVocabulary = async frameKey => {
  const frameResult = await executeSql(
    `SELECT * FROM sentence_frames WHERE key = ?`,
    [frameKey]
  );

  if (frameResult.rows.length === 0) return null;

  const frame = frameResult.rows.item(0);

  const vocabResult = await executeSql(
    `
    SELECT v.text
    FROM vocabulary v
    JOIN slot_vocabulary sv ON sv.vocab_id = v.id
    JOIN frame_slots fs ON fs.id = sv.slot_id
    WHERE fs.frame_id = ?
    `,
    [frame.id]
  );

  return {
    frame,
    vocabulary: vocabResult.rows._array
  };
};
