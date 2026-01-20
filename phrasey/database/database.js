import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("language.db");

export const executeSql = async (sql, params = []) => {
  try {
    const result = await db.runAsync(sql, params);
    return result;
  } catch (error) {
    throw error;
  }
};
