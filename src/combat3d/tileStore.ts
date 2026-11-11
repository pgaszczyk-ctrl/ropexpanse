// Map tiles as the game keeps them: read from the browser's store (IndexedDB) or, when
// missing, decoded from the world archive and stored. This module has no ties to the
// page, so it runs in the tile worker (tileWorker.ts) as well as on the main thread.
import { elementsInBox, type OsmElement } from "./osmTiles.ts";

export const WORLD_VERSION = 2;
export type Tile = {
  v: number;
  key: string;
  elements: OsmElement[];
  savedAt: number;
};
export type TileBox = { south: number; west: number; north: number; east: number };
const CACHED_TILES = 96;
let dbPromise: Promise<IDBDatabase> | undefined;
function database() {
  return (dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
    const r = indexedDB.open("ropexpanse-world", 2);
    r.onupgradeneeded = () => {
      const store = r.result.objectStoreNames.contains("tiles")
        ? r.transaction!.objectStore("tiles")
        : r.result.createObjectStore("tiles", { keyPath: "key" });
      // Age index: old tiles are found by key alone, without reading any tile back.
      if (!store.indexNames.contains("savedAt")) store.createIndex("savedAt", "savedAt");
    };
    r.onsuccess = () => {
      // Another tab with a newer game may need to upgrade the store: let it.
      r.result.onversionchange = () => r.result.close();
      resolve(r.result);
    };
    r.onerror = () => reject(r.error);
    // An old tab still holds the store open: play without it rather than wait.
    r.onblocked = () => reject(Error("tile store is busy"));
  }));
}
async function cached(key: string): Promise<Tile | undefined> {
  try {
    const db = await database();
    return await new Promise((resolve, reject) => {
      const r = db.transaction("tiles").objectStore("tiles").get(key);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  } catch {
    return undefined;
  }
}
export async function cache(tile: Tile) {
  try {
    const db = await database();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("tiles", "readwrite");
      tx.objectStore("tiles").put(tile);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    // Keep the newest 96 tiles. Only keys are read: this used to load every stored tile
    // after each save, which froze the game for a moment per tile (report of 11 Nov).
    const store = db.transaction("tiles", "readwrite").objectStore("tiles"),
      count = store.count();
    count.onsuccess = () => {
      let extra = count.result - CACHED_TILES;
      if (extra <= 0) return;
      const walk = store.index("savedAt").openKeyCursor();
      walk.onsuccess = () => {
        const c = walk.result;
        if (!c || extra-- <= 0) return;
        store.delete(c.primaryKey);
        c.continue();
      };
    };
  } catch {
    /* Play remains available when persistent cache is full/disabled. */
  }
}
/** One game tile: from the store when it is there, else from the world archive. */
export async function readTile(key: string, box: TileBox): Promise<Tile> {
  const stored = await cached(key);
  if (stored && stored.v === WORLD_VERSION) return stored;
  const tile = { v: WORLD_VERSION, key, elements: await elementsInBox(box), savedAt: Date.now() };
  // Stored in the background; whoever asked does not wait for the disk.
  void cache(tile);
  return tile;
}
