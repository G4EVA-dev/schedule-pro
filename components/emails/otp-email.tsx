import { Html, Head, Body, Container, Section, Text } from '@react-email/components';

interface OtpEmailProps {
  code: string;
  expiresAt: number;
}

export function OtpEmail({ code, expiresAt }: OtpEmailProps) {
  const expiryMinutes = Math.round((expiresAt - Date.now()) / 60000);
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Your SchedulePro Verification Code</Text>
          <Text style={paragraph}>
            Use the following code to verify your email address:
          </Text>
          <Section style={codeContainer}>
            <span style={codeStyle}>{code}</span>
          </Section>
          <Text style={paragraph}>
            This code will expire in {expiryMinutes > 0 ? expiryMinutes : 15} minutes.
          </Text>
          <Text style={footer}>
            If you didn't request this, you can safely ignore this email.<br />
            © {new Date().getFullYear()} SchedulePro
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif', padding: '20px 0' };
const container = { backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px', margin: '0 auto', maxWidth: '600px', padding: '40px' };
const heading = { color: '#333', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' };
const paragraph = { color: '#666', fontSize: '16px', lineHeight: '24px', margin: '16px 0' };
const codeContainer = { margin: '32px 0', textAlign: 'center' as const };
const codeStyle = { display: 'inline-block', background: '#2563eb', color: '#fff', fontSize: '2rem', letterSpacing: '0.5rem', borderRadius: '8px', padding: '16px 32px', fontWeight: 'bold', fontFamily: 'monospace' };
const footer = { color: '#999', fontSize: '14px', marginTop: '40px', textAlign: 'center' as const };