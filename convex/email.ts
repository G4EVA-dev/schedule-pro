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
    <p style="font-size: 12px; color: #6b7280; margin-top:40px; text-align:center;">Powered by <a href="https://resend.com" target="_blank" rel="noopener" style="color:#2563eb; text-decoration:none;">Resend</a></p>
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
      from: `${process.env.SENDER_NAME || 'SchedulePro'} <${process.env.FROM_EMAIL || 'appointments@email.schedulepro.store'}>`,
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

    // Personalize email for staff vs. client
    let html;
    if (type === 'staff') {
      html = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #2563eb;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2563eb; font-size: 24px; margin: 0;">SchedulePro</h1>
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Staff Notification</p>
          </div>
          
          <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 16px;">🗓️ New Appointment Assigned</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Hi <strong>${staffName}</strong>,
          </p>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            You have been assigned a new appointment. Here are the details:
          </p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 12px 0;">📋 Appointment Details</h3>
            <p style="margin: 8px 0; color: #374151;"><strong>Service:</strong> ${serviceName}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Client:</strong> ${clientName}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Start Time:</strong> ${prettyDate}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>End Time:</strong> ${prettyEnd}</p>
            ${notes ? `<p style="margin: 8px 0; color: #374151;"><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 25px 0;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">Please log in to SchedulePro to manage this appointment</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://schedule-pro-omega.vercel.app'}/calendar" 
               style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
              View in Dashboard
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 30px;">
            Best regards,<br/>
            The SchedulePro Team
          </p>
        </div>
        <p style="font-size: 12px; color: #6b7280; margin-top: 20px; text-align: center;">
          Powered by <a href="https://resend.com" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: none;">Resend</a>
        </p>
      </div>`;
    } else {
      html = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #10b981;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2563eb; font-size: 24px; margin: 0;">SchedulePro</h1>
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Appointment Confirmation</p>
          </div>
          
          <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 16px;">✅ Your Appointment is Confirmed!</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Hi <strong>${clientName}</strong>,
          </p>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Great news! Your appointment has been confirmed. Here are your appointment details:
          </p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #bbf7d0;">
            <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 12px 0;">📅 Appointment Details</h3>
            <p style="margin: 8px 0; color: #374151;"><strong>Service:</strong> ${serviceName}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Provider:</strong> ${staffName}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Date & Time:</strong> ${prettyDate}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Duration:</strong> Until ${prettyEnd}</p>
            ${notes ? `<p style="margin: 8px 0; color: #374151;"><strong>Special Notes:</strong> ${notes}</p>` : ''}
          </div>
          
          <div style="background-color: #eff6ff; padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #bfdbfe;">
            <p style="color: #1e40af; font-size: 14px; margin: 0; font-weight: 500;">💡 <strong>Reminder:</strong> You'll receive a reminder email 30 minutes before your appointment.</p>
          </div>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            If you need to reschedule or cancel, please contact us as soon as possible.
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 30px;">
            Thank you for choosing SchedulePro!<br/>
            We look forward to serving you.
          </p>
        </div>
        <p style="font-size: 12px; color: #6b7280; margin-top: 20px; text-align: center;">
          Powered by <a href="https://resend.com" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: none;">Resend</a>
        </p>
      </div>`;
    }

    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error('RESEND_API_KEY environment variable is not set. Please add it to your Convex dashboard at https://dashboard.convex.dev → Settings → Environment Variables');
      }
      
      // Log email payload for debugging
      console.log('Preparing to send appointment email:', {
        to,
        subject,
        type,
        appointment,
      });
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: `${process.env.SENDER_NAME || 'SchedulePro'} <${process.env.FROM_EMAIL || 'appointments@email.schedulepro.store'}>`,
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

// Send password reset email
// Send password reset success email
export const sendPasswordResetSuccessEmail = internalAction({
  args: {
    to: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const { to, userName } = args;
    const html = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color:#2563eb;">Password Changed Successfully</h2>
      <p>Hi ${userName},</p>
      <p>Your SchedulePro password was changed successfully. If you did not perform this action, please contact support immediately.</p>
      <p>Best regards,<br/>The SchedulePro Team</p>
      <p style="font-size: 12px; color: #6b7280; margin-top:40px; text-align:center;">Powered by <a href="https://resend.com" target="_blank" rel="noopener" style="color:#2563eb; text-decoration:none;">Resend</a></p>
      <p style="font-size: 12px; color: #6b7280; margin-top:40px; text-align:center;">Powered by <a href="https://resend.com" target="_blank" rel="noopener" style="color:#2563eb; text-decoration:none;">Resend</a></p>
    </div>`;
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) throw new Error('RESEND_API_KEY env var not set');
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: `${process.env.SENDER_NAME || 'SchedulePro'} <${process.env.FROM_EMAIL || 'noreply@schedulepro.store'}>` ,
        to,
        subject: 'Your SchedulePro password was changed',
        html,
      });
    } catch (error) {
      console.error('Failed to send password reset success email:', error);
      throw new Error(`Failed to send confirmation email: ${error}`);
    }
  },
});

export const sendPasswordResetEmail = internalAction({
  args: {
    to: v.string(),
    resetUrl: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const { to, resetUrl, userName } = args;

    const html = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; font-size: 24px; margin: 0;">SchedulePro</h1>
        </div>

        <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 16px;">
          Password Reset Request
        </h2>

        <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          Hi ${userName},
        </p>

        <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          We received a request to reset your password for your SchedulePro account. Click the button below to set a new password:
        </p>

        <div style="text-align: center; margin-bottom: 32px;">
          <a
            href="${resetUrl}"
            style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;"
          >
            Reset Password
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">
          If you didn't request this password reset, you can safely ignore this email. The link will expire in 24 hours.
        </p>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
          Best regards,<br />
          The SchedulePro Team
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
        <p>
          If the button doesn't work, copy and paste this link into your browser:<br />
          <span style="color: #2563eb;">${resetUrl}</span>
        </p>
      </div>
      <p style="font-size: 12px; color: #6b7280; margin-top:40px; text-align:center;">Powered by <a href="https://resend.com" target="_blank" rel="noopener" style="color:#2563eb; text-decoration:none;">Resend</a></p>
    </div>`;

    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error('RESEND_API_KEY environment variable is not set. Please add it to your Convex dashboard at https://dashboard.convex.dev → Settings → Environment Variables');
      }
      
      console.log('Sending password reset email to:', to);
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: `${process.env.SENDER_NAME || 'SchedulePro'} <${process.env.FROM_EMAIL || 'noreply@email.schedulepro.store'}>`,
        to,
        subject: 'Reset your SchedulePro password',
        html,
      });
      console.log('Password reset email sent successfully to:', to);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw new Error(`Failed to send password reset email: ${error}`);
    }
  },
});