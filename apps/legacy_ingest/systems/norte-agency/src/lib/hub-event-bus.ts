import { randomUUID } from "node:crypto";
import { registerWebhookEvent } from "@/lib/webhook-hub-store";

type HubActor = {
  userId: string;
  tenantId: string;
  role?: string;
};

type PublishHubEventInput = {
  eventType: string;
  actor: HubActor;
  payload: Record<string, unknown>;
  occurredAt?: string;
};

type HubEnvelope = {
  id: string;
  source: "agency-os";
  target: "crm-med";
  eventType: string;
  occurredAt: string;
  actor: HubActor;
  payload: Record<string, unknown>;
};

const crmMedWebhookUrl = process.env.HUB_CRM_MED_WEBHOOK_URL;

function createEnvelope(input: PublishHubEventInput): HubEnvelope {
  return {
    id: randomUUID(),
    source: "agency-os",
    target: "crm-med",
    eventType: input.eventType,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    actor: input.actor,
    payload: input.payload,
  };
}

export async function publishHubEvent(input: PublishHubEventInput): Promise<void> {
  const envelope = createEnvelope(input);

  // Always register locally so the hub can track events even if remote is unavailable.
  registerWebhookEvent({
    service: envelope.source,
    eventType: envelope.eventType,
    occurredAt: envelope.occurredAt,
    revenue: 0,
    activeUsers: 1,
    actorUserId: envelope.actor.userId,
    actorTenantId: envelope.actor.tenantId,
    rawPayload: envelope as unknown as Record<string, unknown>,
  });

  if (!crmMedWebhookUrl) return;

  try {
    await fetch(crmMedWebhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-hub-event-id": envelope.id,
        "x-hub-source": envelope.source,
        "x-hub-user-id": envelope.actor.userId,
        "x-hub-tenant-id": envelope.actor.tenantId,
      },
      body: JSON.stringify(envelope),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Hub event dispatch failed:", error);
  }
}
