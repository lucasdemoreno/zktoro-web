import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "../../../serverUtils/uploadImage";
import { saveStrategyToDB } from "@/db/db";
import { StrategyToCreate } from "@/types/create";

export async function POST(request: Request) {
  console.log("building image...");

  try {
    const strategyBody = (await request.json()) as StrategyToCreate;
    const strategyId = uuidv4();
    strategyBody.id = strategyId;
    const result = await uploadImage(strategyBody);
    const dbResult = await saveStrategyToDB(strategyBody);

    console.log("DB created", result, dbResult);

    return NextResponse.json({ message: dbResult });
  } catch (err) {
    console.log(err);

    return Response.json({ error: err }, { status: 500 });
  }
}
