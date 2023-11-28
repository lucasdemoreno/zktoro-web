import { NextResponse } from "next/server";
import { getAllStrategies } from "@/db/db";

export async function GET(request: Request) {
  try {
    const result = await getAllStrategies();

    return NextResponse.json({ message: result });
  } catch (err) {
    console.log(err);

    return Response.json({ error: err }, { status: 500 });
  }
}
