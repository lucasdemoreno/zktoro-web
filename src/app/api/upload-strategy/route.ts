import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { saveStrategyToDB } from "@/db/db";
import { StrategyToCreate } from "@/types/create";

export const maxDuration = 120; // This function can run for a maximum of 12 seconds

export async function POST(request: Request) {
  console.log("building image...");

  try {
    const strategyBody = (await request.json()) as StrategyToCreate;
    const strategyId = uuidv4();
    strategyBody.id = strategyId;
    const tonyServer = "http://43.156.147.65:8001";

    const responseLogin = await fetch(`${tonyServer}/uploadImage/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strategyId, pythonCode: strategyBody.pythonCode }),
    });

    console.log("responseLogin", responseLogin);
    const dbResult = await saveStrategyToDB(strategyBody);

    return NextResponse.json({ message: dbResult });
  } catch (err) {
    console.log(err);

    return Response.json({ error: err }, { status: 500 });
  }
}
