import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/emails/welcome-email';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string, verificationToken: string) {
  const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.SENDER_NAME || 'SchedulePro'} <${process.env.FROM_EMAIL || 'welcome@email.schedulepro.store'}>`,
      to: email,
      subject: 'Welcome to SchedulePro - Verify Your Email',
      react: WelcomeEmail({ name, verificationLink }),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}