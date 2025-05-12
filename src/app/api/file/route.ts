import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/lib/pinata"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const { cid } = await pinata.upload.public.file(file)
    const url = await pinata.gateways.public.convert(cid);
    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cid = searchParams.get("cid");
  if (!cid) {
    return NextResponse.json({ error: "CID is required" }, { status: 400 });
  }
  const url = await pinata.gateways.public.convert(cid as string);

  const json = await fetch(url);
  const data = await json.json();
  return NextResponse.json(data, { status: 200 });
}
