// Downloads, decodes and meshes map tiles off the main thread, so walking and
// the camp animation stay smooth while kilometres of map are prepared.
import { loadTile } from "./tiles.ts";
import { transferables } from "./region.ts";
import type { Origin } from "./geo.ts";

type Job = { id: number; template: string; tx: number; ty: number; origin: Origin; scale: number };
self.onmessage = async (event: MessageEvent<Job>) => {
  const { id, template, tx, ty, origin, scale } = event.data;
  try {
    const region = await loadTile(template, tx, ty, origin, scale);
    (self as unknown as Worker).postMessage({ id, region }, transferables(region));
  } catch (error) {
    (self as unknown as Worker).postMessage({ id, error: error instanceof Error ? error.message : String(error) });
  }
};
