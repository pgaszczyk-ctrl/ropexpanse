// Worker side of map loading: reads a game tile (browser store or world archive) off the
// main thread and posts it back. See loadTile in world.ts.
import { useWorldUrl } from "./osmTiles.ts";
import { readTile, type TileBox } from "./tileStore.ts";

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<{ id: number; key: string; box: TileBox; world: string }>) => void) | null;
  postMessage(message: unknown): void;
};
scope.onmessage = async (e) => {
  const { id, key, box, world } = e.data;
  try {
    useWorldUrl(world);
    scope.postMessage({ id, tile: await readTile(key, box) });
  } catch (error) {
    scope.postMessage({ id, error: error instanceof Error ? error.message : String(error) });
  }
};
