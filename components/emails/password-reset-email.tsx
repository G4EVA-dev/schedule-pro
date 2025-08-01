import React from 'react';

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
}

export function PasswordResetEmail({ userName, resetUrl }: PasswordResetEmailProps) {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
        }}>
          <h1 style={{
            color: '#2563eb',
            fontSize: '24px',
            margin: '0',
          }}>
            SchedulePro
          </h1>
        </div>

        <h2 style={{
          color: '#1f2937',
          fontSize: '20px',
          marginBottom: '16px',
        }}>
          Password Reset Request
        </h2>

        <p style={{
          color: '#4b5563',
          fontSize: '16px',
          lineHeight: '1.5',
          marginBottom: '24px',
        }}>
          Hi {userName},
        </p>

        <p style={{
          color: '#4b5563',
          fontSize: '16px',
          lineHeight: '1.5',
          marginBottom: '24px',
        }}>
          We received a request to reset your password for your SchedulePro account. Click the button below to set a new password:
        </p>

        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <a
            href={resetUrl}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-block',
            }}
          >
            Reset Password
          </a>
        </div>

        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '16px',
        }}>
          If you didn't request this password reset, you can safely ignore this email. The link will expire in 24 hours.
        </p>

        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '0',
        }}>
          Best regards,<br />
          The SchedulePro Team
        </p>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        color: '#9ca3af',
        fontSize: '12px',
      }}>
        <p>
          If the button doesn't work, copy and paste this link into your browser:
          <br />
          <span style={{ color: '#2563eb' }}>{resetUrl}</span>
        </p>
      </div>
    </div>
  );
}
