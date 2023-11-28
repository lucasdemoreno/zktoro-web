import {
  BrowseStrategy,
  strategy1,
  strategy2,
  strategy3,
  strategy4,
} from "@/types/browse";
import { kv } from "@vercel/kv";

/**
 * This won't be needed when we publish the
 * strategies to the database
 */
async function populateDBIfNeeded() {
  const list = await kv.lrange("browseStrategies1", 0, -1);
  if (list.length === 0) {
    await kv.set(`strategy:${strategy1.id}`, strategy1);
    await kv.set(`strategy:${strategy2.id}`, strategy2);
    await kv.set(`strategy:${strategy3.id}`, strategy3);
    await kv.set(`strategy:${strategy4.id}`, strategy4);

    await kv.lpush(
      "browseStrategies1",
      `strategy:${strategy1.id}`,
      `strategy:${strategy2.id}`,
      `strategy:${strategy3.id}`,
      `strategy:${strategy4.id}`
    );
  }
}

export async function getAllStrategies(): Promise<BrowseStrategy[]> {
  try {
    await populateDBIfNeeded();
  } catch (error) {
    console.log(error);
  }

  try {
    // 0 is the first element; -1 is the last element
    // So this returns the whole list
    const strategyIds = await kv.lrange("browseStrategies1", 0, -1);
    const maybeStrategies = await Promise.all(
      strategyIds.map((id) => {
        return kv.get<BrowseStrategy>(id);
      })
    );
    const strategies = maybeStrategies.filter((s) => !!s) as BrowseStrategy[];
    return strategies;
  } catch (error) {
    console.log(error);
    // Handle errors
    return [];
  }
}

export async function getStrategyById(
  id: string
): Promise<BrowseStrategy | null> {
  try {
    const strategy = await kv.get<BrowseStrategy>(`strategy:${id}`);

    return strategy;
  } catch (error) {
    console.log(error);
    // Handle errors
    return strategy1;
  }
}
