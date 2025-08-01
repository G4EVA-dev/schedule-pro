import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendAppointmentEmail({
  to,
  subject,
  appointment,
  type = 'creation',
}: {
  to: string;
  subject: string;
  appointment: {
    clientName: string;
    staffName: string;
    serviceName: string;
    startTime: Date;
    endTime: Date;
    notes?: string;
  };
  type?: 'creation' | 'reminder';
}) {
  const { clientName, staffName, serviceName, startTime, endTime, notes } = appointment;
  const prettyDate = startTime.toLocaleString();
  const prettyEnd = endTime.toLocaleString();
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

  return resend.emails.send({
    from: `${process.env.SENDER_NAME || 'SchedulePro'} <${process.env.FROM_EMAIL || 'appointments@email.schedulepro.store'}>`,
    to,
    subject,
    html,
  });
}
