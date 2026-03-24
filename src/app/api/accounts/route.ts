import { NextResponse } from "next/server";
import { getAccounts } from "@/lib/data";

export async function GET() {
  const accounts = await getAccounts();
  return NextResponse.json(accounts);
}
