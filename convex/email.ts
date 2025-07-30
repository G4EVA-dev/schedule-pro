// convex/email.ts
import { httpAction, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from 'resend';

export const sendAppointmentEmail = httpAction(async (ctx, request) => {
  const { to, subject, appointment, type } = await request.json();
  
  const { clientName, staffName, serviceName, startTime, endTime, notes } = appointment;
  const prettyDate = new Date(startTime).toLocaleString();
  const prettyEnd = new Date(endTime).toLocaleString();
  const action = type === 'reminder' ? 'Reminder: Upcoming' : 'New';

  const html = `<div style="font-family: sans-serif;">
    <h2>${action} Appointment</h2>
    <p>Hello ${clientName},</p>
    <p>Your appointment for <b>${serviceName}</b> with <b>${staffName}</b> is scheduled for:</p>
    <ul>
      <li><b>Start:</b> ${prettyDate}</li>
      <li><b>End:</b> ${prettyEnd}</li>
    </ul>
    ${notes ? `<p><b>Notes:</b> ${notes}</p>` : ''}
    <p>Thank you for choosing SchedulePro.</p>
  </div>`;

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY environment variable is not set. Please add it to your Convex dashboard.');
      return new Response(JSON.stringify({ error: "Email service not configured" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'SchedulePro <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Failed to send email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});

// Internal action that can be scheduled from mutations
export const sendAppointmentEmailInternal = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    appointment: v.object({
      clientName: v.string(),
      staffName: v.string(),
      serviceName: v.string(),
      startTime: v.number(),
      endTime: v.number(),
      notes: v.optional(v.string()),
    }),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const { to, subject, appointment, type } = args;
    
    const { clientName, staffName, serviceName, startTime, endTime, notes } = appointment;
    const prettyDate = new Date(startTime).toLocaleString();
    const prettyEnd = new Date(endTime).toLocaleString();
    const action = type === 'reminder' ? 'Reminder: Upcoming' : 'New';

    const html = `<div style="font-family: sans-serif;">
      <h2>${action} Appointment</h2>
      <p>Hello ${clientName},</p>
      <p>Your appointment for <b>${serviceName}</b> with <b>${staffName}</b> is scheduled for:</p>
      <ul>
        <li><b>Start:</b> ${prettyDate}</li>
        <li><b>End:</b> ${prettyEnd}</li>
      </ul>
      ${notes ? `<p><b>Notes:</b> ${notes}</p>` : ''}
      <p>Thank you for choosing SchedulePro.</p>
    </div>`;

    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error('RESEND_API_KEY environment variable is not set. Please add it to your Convex dashboard at https://dashboard.convex.dev → Settings → Environment Variables');
      }
      
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: 'SchedulePro <onboarding@resend.dev>',
        to,
        subject,
        html,
      });
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error(`Failed to send email: ${error}`);
    }
  },
});