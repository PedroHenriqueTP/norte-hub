import { NextRequest, NextResponse } from "next/server";
import { registerWebhookEvent } from "@/lib/webhook-hub-store";

function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ service: string }> },
) {
  const { service } = await context.params;
  const payload = toRecord(await request.json().catch(() => ({})));
  const actorUserIdHeader = request.headers.get("x-hub-user-id");
  const actorTenantIdHeader = request.headers.get("x-hub-tenant-id");

  const eventType = typeof payload.eventType === "string" ? payload.eventType : "unknown_event";
  const occurredAtRaw = typeof payload.occurredAt === "string" ? payload.occurredAt : new Date().toISOString();
  const occurredAt = Number.isNaN(new Date(occurredAtRaw).valueOf())
    ? new Date().toISOString()
    : new Date(occurredAtRaw).toISOString();

  // Accept common webhook metric field names for easier multi-service integration.
  const revenue = toNumber(payload.revenue ?? payload.amount ?? payload.value);
  const activeUsers = toNumber(payload.activeUsers ?? payload.users ?? payload.userCount);

  registerWebhookEvent({
    service,
    eventType,
    occurredAt,
    revenue,
    activeUsers,
    actorUserId:
      typeof payload.actorUserId === "string"
        ? payload.actorUserId
        : actorUserIdHeader ?? undefined,
    actorTenantId:
      typeof payload.actorTenantId === "string"
        ? payload.actorTenantId
        : actorTenantIdHeader ?? undefined,
    rawPayload: payload,
  });

  return NextResponse.json(
    {
      ok: true,
      message: "Webhook processed",
      normalized: { service, eventType, occurredAt, revenue, activeUsers },
    },
    { status: 202 },
  );
}
