import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request): Promise<Response> {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  console.log(
    "hlllffsdafafadfasfasfffffffffffffffffffffffffffffffffffffffffffffffff"
  );

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = ensureProperPadding(headerPayload.get("svix-id") ?? "");
  const svix_timestamp = ensureProperPadding(
    headerPayload.get("svix-timestamp") ?? ""
  );
  const svix_signature = ensureProperPadding(
    headerPayload.get("svix-signature") ?? ""
  );

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    console.log("evt");
    console.log("evt", evt);

    if (evt.type === "user.created") {
      console.log("user created");
    }
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}

// Helper function to ensure base64 strings are properly padded
function ensureProperPadding(base64: string): string {
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return base64;
}
