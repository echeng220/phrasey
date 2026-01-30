import AsyncStorage from "@react-native-async-storage/async-storage";
import { PACK_REGISTRY } from "../data/packRegistry";

const INITIAL_FREE_UNLOCKS_PER_LANGUAGE = 1;

const STORAGE_KEYS = {
  UNLOCKED_PACKS: "unlocked_packs",
  FREE_UNLOCKS: "free_unlocks",
  INITIALIZED: "unlocks_initialized"
};

/* ---------------------------
   Helpers
---------------------------- */

async function getJson(key, defaultValue) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.warn("AsyncStorage read error:", key, e);
    return defaultValue;
  }
}

async function setJson(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("AsyncStorage write error:", key, e);
  }
}

/* ---------------------------
   Public API
---------------------------- */

const UnlockManager = {
  /* ---------- READ ---------- */

  async getUnlockedPacks() {
    return await getJson(STORAGE_KEYS.UNLOCKED_PACKS, []);
  },

  async getFreeUnlocks() {
    return await getJson(STORAGE_KEYS.FREE_UNLOCKS, {});
  },

  async canAccessPack(packId) {
    const unlockedPacks = await this.getUnlockedPacks();
    return unlockedPacks.includes(packId);
  },

  /* ---------- WRITE ---------- */

  async initializeFreeUnlocks(language, count) {
    const freeUnlocks = await this.getFreeUnlocks();

    if (freeUnlocks[language] == null) {
      freeUnlocks[language] = count;
      await setJson(STORAGE_KEYS.FREE_UNLOCKS, freeUnlocks);
    }
  },

  async unlockPack(packId, language, source = "free") {
    const unlockedPacks = await this.getUnlockedPacks();

    if (unlockedPacks.includes(packId)) {
      return false; // already unlocked
    }

    if (source === "free") {
      const freeUnlocks = await this.getFreeUnlocks();
      const remaining = freeUnlocks[language] || 0;

      if (remaining <= 0) {
        throw new Error("No free unlocks remaining");
      }

      freeUnlocks[language] = remaining - 1;
      await setJson(STORAGE_KEYS.FREE_UNLOCKS, freeUnlocks);
    }

    unlockedPacks.push(packId);
    await setJson(STORAGE_KEYS.UNLOCKED_PACKS, unlockedPacks);

    return true;
  },

  /* ---------- INITIALIZATION ---------- */

  async initialize() {
    console.log('Initializing UnlockManager...');
    
    // Check if already initialized
    const isInitialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (isInitialized === "true") {
      console.log('Already initialized, skipping...');
      return;
    }

    // Get unique languages from PACK_REGISTRY
    const languages = [...new Set(
      PACK_REGISTRY.map(p => p.language)
    )];
    
    console.log('Languages found:', languages);

    // Initialize free unlocks for each language
    const freeUnlocks = {};
    languages.forEach(lang => {
      freeUnlocks[lang] = INITIAL_FREE_UNLOCKS_PER_LANGUAGE;
    });

    console.log('Setting free unlocks:', freeUnlocks);
    
    // Store the free unlocks
    await setJson(STORAGE_KEYS.FREE_UNLOCKS, freeUnlocks);
    
    // Mark as initialized
    await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
    
    console.log('UnlockManager initialized successfully');
  },

  /* ---------- RESET (DEV ONLY) ---------- */

  async resetAll() {
    console.log('Resetting UnlockManager...');
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.UNLOCKED_PACKS,
      STORAGE_KEYS.FREE_UNLOCKS,
      STORAGE_KEYS.INITIALIZED
    ]);
    console.log('UnlockManager reset complete');
  }
};

export default UnlockManager;