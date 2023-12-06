import {
  BrowseStrategy,
  strategy1,
  strategy2,
  strategy3,
  strategy4,
} from "@/types/browse";
import { StrategyToCreate } from "@/types/create";
import { MongoClient, ServerApiVersion } from "mongodb";

let dbConnection: MongoClient | null = null;

function getMongoClient(): MongoClient {
  if (!dbConnection) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }
    dbConnection = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  return dbConnection;
}

async function getCollStrategy() {
  const client = getMongoClient();
  const connection = await client.connect();
  const db = connection.db("zkToro-db");
  const collStrategies = db.collection("strategies");
  return collStrategies;
}

/**
 * This won't be needed when we publish the
 * strategies to the database
 */
async function populateDBIfNeeded() {
  const collStrategies = await getCollStrategy();
  const strategies = await collStrategies.find({}).toArray();

  if (strategies.length === 0) {
    await collStrategies.insertOne(strategy1);
    await collStrategies.insertOne(strategy2);
    await collStrategies.insertOne(strategy3);
    await collStrategies.insertOne(strategy4);
  }
}

export async function getAllStrategies(): Promise<BrowseStrategy[]> {
  try {
    await populateDBIfNeeded();
  } catch (error) {
    console.log(error);
  }

  try {
    const collStrategies = await getCollStrategy();
    const dbStrategies = await collStrategies
      .find({})
      .sort({ _id: -1 })
      .toArray();
    const strategies: BrowseStrategy[] = dbStrategies as any[];

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
    const collStrategies = await getCollStrategy();
    const dbStrategy = await collStrategies.findOne({ id });
    console.log(dbStrategy);
    if (!dbStrategy) {
      return null;
    }

    return dbStrategy as any;
  } catch (error) {
    console.log(error);
    // Handle errors
    return null;
  }
}

export async function saveStrategyToDB(strategyBody: StrategyToCreate) {
  const collStrategies = await getCollStrategy();
  const result = await collStrategies.insertOne(strategyBody);

  console.log("saveStrategyToDB", result, strategyBody.id);
  return strategyBody.id;
}
