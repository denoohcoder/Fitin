import { randomUUID } from 'node:crypto';

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: Record<string, unknown>) => void;
}

interface ApplicationPayload {
  amount: number;
  months: number;
  currency: 'USD' | 'ZiG';
  loanPurpose: string;
}

function isApplicationPayload(value: unknown): value is ApplicationPayload {
  if (!value || typeof value !== 'object') return false;
  const body = value as Record<string, unknown>;
  return (
    typeof body.amount === 'number' && Number.isFinite(body.amount) && body.amount >= 100 && body.amount <= 1_000_000 &&
    typeof body.months === 'number' && Number.isInteger(body.months) && body.months >= 1 && body.months <= 120 &&
    (body.currency === 'USD' || body.currency === 'ZiG') &&
    typeof body.loanPurpose === 'string' && body.loanPurpose.trim().length > 0 && body.loanPurpose.length <= 100
  );
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isApplicationPayload(req.body)) {
    return res.status(400).json({ error: 'Invalid application data' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !adminChatId) {
    console.error('Missing Telegram notification environment variables');
    return res.status(503).json({ error: 'Application notifications are not configured' });
  }

  const application = req.body;
  const reference = `FITIN-${randomUUID().slice(0, 8).toUpperCase()}`;
  const purpose = application.loanPurpose.replace(/[\r\n\u0000-\u001f]/g, ' ').trim();
  const message = [
    'New demo application submitted — pending review',
    `Reference: ${reference}`,
    `Requested amount: ${application.currency} ${application.amount.toLocaleString()}`,
    `Term: ${application.months} months`,
    `Purpose: ${purpose}`,
    '',
    'No applicant contact details, national ID, or income were included.',
  ].join('\n');

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: adminChatId, text: message }),
    });

    if (!telegramResponse.ok) {
      const responseBody = await telegramResponse.text();
      console.error('Telegram notification failed:', telegramResponse.status, responseBody);
      return res.status(502).json({ error: 'Could not notify the admin. Please try again.' });
    }

    return res.status(200).json({ success: true, reference });
  } catch (error) {
    console.error('Telegram notification request failed:', error);
    return res.status(502).json({ error: 'Could not notify the admin. Please try again.' });
  }
}
