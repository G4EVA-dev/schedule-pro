import { Html, Head, Body, Container, Section, Text, Link } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  verificationLink: string;
}

export function WelcomeEmail({ name, verificationLink }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Welcome to SchedulePro!</Text>
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>
            Thank you for signing up. Please verify your email address by clicking the button below:
          </Text>
          <Section style={buttonContainer}>
            <Link href={verificationLink} style={button}>
              Verify Email
            </Link>
          </Section>
          <Text style={paragraph}>
            Or copy and paste this link into your browser:
            <br />
            <Link href={verificationLink} style={link}>
              {verificationLink}
            </Link>
          </Text>
          <Text style={paragraph}>
            If you didn't create an account, you can safely ignore this email.
          </Text>
          <Text style={footer}>© {new Date().getFullYear()} SchedulePro</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Arial, sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '40px',
};

const heading = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const paragraph = {
  color: '#666666',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const buttonContainer = {
  margin: '24px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 24px',
  textDecoration: 'none',
};

const link = {
  color: '#2563eb',
  textDecoration: 'none',
  wordBreak: 'break-all' as const,
};

const footer = {
  color: '#999999',
  fontSize: '14px',
  marginTop: '40px',
  textAlign: 'center' as const,
};