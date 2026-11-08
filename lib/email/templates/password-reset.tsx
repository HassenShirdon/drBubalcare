import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email';

const BRAND = '#002D62';
const TEXT = '#1c2b3a';
const MUTED = '#6b7a8c';

export interface PasswordResetEmailProps {
  name?: string | null;
  resetUrl: string;
  expiresInMinutes: number;
}

export function PasswordResetEmail({
  name,
  resetUrl,
  expiresInMinutes = 60,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Dr. Bubal Care password</Preview>
      <Body
        style={{
          margin: 0,
          padding: '24px 0',
          backgroundColor: '#f5f7fa',
          fontFamily:
            "Arial, 'Helvetica Neue', Helvetica, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: 560,
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e3e8ef',
          }}
        >
          <Section style={{ padding: '32px 40px 0 40px' }}>
            <Text
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: BRAND,
                letterSpacing: '-0.2px',
              }}
            >
              Dr. Bubal Care
            </Text>
          </Section>
          <Section style={{ padding: '32px 40px 40px 40px' }}>
            <Heading
              as="h1"
              style={{
                margin: '0 0 12px 0',
                fontSize: 22,
                color: TEXT,
                fontWeight: 700,
              }}
            >
              Reset your password
            </Heading>
            <Text style={{ margin: '0 0 16px 0', fontSize: 15, lineHeight: '24px', color: TEXT }}>
              Hi {name || 'there'},
            </Text>
            <Text style={{ margin: '0 0 24px 0', fontSize: 15, lineHeight: '24px', color: TEXT }}>
              We received a request to reset the password for your Dr. Bubal Care
              account. Click the button below to choose a new password. This link
              expires in {expiresInMinutes} minutes and can only be used once.
            </Text>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: BRAND,
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 700,
                padding: '12px 28px',
                borderRadius: 8,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Reset password
            </Button>
            <Text style={{ margin: '24px 0 8px 0', fontSize: 13, lineHeight: '20px', color: MUTED }}>
              Or copy and paste this link into your browser:
            </Text>
            <Text style={{ margin: '0 0 24px 0', fontSize: 13, lineHeight: '20px', wordBreak: 'break-all' }}>
              <Link href={resetUrl} style={{ color: BRAND }}>
                {resetUrl}
              </Link>
            </Text>
            <Hr style={{ margin: '24px 0', borderColor: '#e3e8ef' }} />
            <Text style={{ margin: '0 0 8px 0', fontSize: 13, lineHeight: '20px', color: MUTED }}>
              If you didn't request a password reset, you can safely ignore this
              email — your password will not change.
            </Text>
            <Text style={{ margin: 0, fontSize: 12, lineHeight: '18px', color: MUTED }}>
              This is an automated message from Dr. Bubal Care. For questions,
              contact support@drbubalcare.com.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default PasswordResetEmail;
