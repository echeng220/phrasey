import { PACK_REGISTRY } from "../data/packRegistry";
import UnlockManager from "./UnlockManager";
import { PACK_DATA } from "../data/packData";

export async function loadPackState() {
  const unlocked = await UnlockManager.getUnlockedPacks();
  const freeUnlocks = await UnlockManager.getFreeUnlocks();

  const allPacks = PACK_REGISTRY.map(pack => ({
    ...pack,
    unlocked: unlocked.includes(pack.id),
    data: unlocked.includes(pack.id) ? PACK_DATA[pack.id] : null
  }));

  return {
    allPacks,
    unlockedPacks: unlocked,
    freeUnlocks
  };
}
