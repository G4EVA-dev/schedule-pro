// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { sendAppointmentEmail } from "./email";

const http = httpRouter();

// Mount the email route
http.route({
  path: "/sendAppointmentEmail",
  method: "POST",
  handler: sendAppointmentEmail
});

// Add a test endpoint
http.route({
  path: "/test",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  })
});

export default http;