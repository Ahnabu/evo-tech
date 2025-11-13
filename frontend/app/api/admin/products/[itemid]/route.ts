import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemid: string }> }
) {
  return NextResponse.json(
    { message: "Product detail endpoint - under construction" },
    { status: 501 }
  );
}
