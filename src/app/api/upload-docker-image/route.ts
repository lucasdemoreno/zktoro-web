import { NextResponse } from "next/server";
import { uploadImage } from "../../../serverUtils/uploadImage";

export async function GET(request: Request) {
  console.log("building image...");

  try {
    const result = await uploadImage();
    console.log("image built", result);

    return NextResponse.json({ message: result });
  } catch (err) {
    console.log(err);

    return Response.json({ error: err }, { status: 500 });
  }
}
