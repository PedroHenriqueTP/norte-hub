import { NextResponse } from "next/server";
import { getHubSummary } from "@/lib/webhook-hub-store";

export async function GET() {
  return NextResponse.json(getHubSummary(14));
}
