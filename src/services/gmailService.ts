import { getAccessToken } from './gmailAuth';

export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessageItem {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  date?: string;
  bodyText?: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
}

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

// Helper to encode utf-8 string to base64url for Gmail RFC 2822
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function fetchUserProfile() {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail');

  const res = await fetch(`${GMAIL_API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch profile: ${res.statusText}`);
  }
  return res.json();
}

export async function listGmailMessages(maxResults: number = 15, query: string = ''): Promise<GmailMessageItem[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail');

  let url = `${GMAIL_API_BASE}/messages?maxResults=${maxResults}`;
  if (query) {
    url += `&q=${encodeURIComponent(query)}`;
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to list emails: ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.messages || data.messages.length === 0) {
    return [];
  }

  // Fetch header details for each message in parallel
  const details = await Promise.all(
    data.messages.slice(0, 15).map(async (msg: { id: string; threadId: string }) => {
      try {
        const msgRes = await fetch(`${GMAIL_API_BASE}/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!msgRes.ok) return { id: msg.id, threadId: msg.threadId };
        const msgData = await msgRes.json();

        const headers: GmailMessageHeader[] = msgData.payload?.headers || [];
        const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const date = headers.find(h => h.name.toLowerCase() === 'date')?.value || '';

        return {
          id: msg.id,
          threadId: msg.threadId,
          snippet: msgData.snippet || '',
          subject,
          from,
          date
        };
      } catch (e) {
        return { id: msg.id, threadId: msg.threadId, subject: 'Error loading header' };
      }
    })
  );

  return details;
}

export async function getMessageDetails(id: string): Promise<GmailMessageItem> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail');

  const res = await fetch(`${GMAIL_API_BASE}/messages/${id}?format=full`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch message details: ${res.statusText}`);
  }

  const msgData = await res.json();
  const headers: GmailMessageHeader[] = msgData.payload?.headers || [];
  const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
  const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
  const date = headers.find(h => h.name.toLowerCase() === 'date')?.value || '';

  // Extract body text if present
  let bodyText = msgData.snippet || '';
  if (msgData.payload?.parts) {
    const textPart = msgData.payload.parts.find((p: any) => p.mimeType === 'text/plain');
    if (textPart?.body?.data) {
      try {
        bodyText = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      } catch (err) {
        // fallback to snippet
      }
    }
  } else if (msgData.payload?.body?.data) {
    try {
      bodyText = atob(msgData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    } catch (err) {
      // fallback to snippet
    }
  }

  return {
    id: msgData.id,
    threadId: msgData.threadId,
    snippet: msgData.snippet,
    subject,
    from,
    date,
    bodyText
  };
}

export async function sendGmailMessage(payload: SendEmailPayload) {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail');

  // RFC 2822 email format
  const emailLines = [
    `To: ${payload.to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(payload.subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    payload.body
  ];

  const raw = base64UrlEncode(emailLines.join('\r\n'));

  const res = await fetch(`${GMAIL_API_BASE}/messages/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to send email: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteGmailMessage(id: string) {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail');

  const res = await fetch(`${GMAIL_API_BASE}/messages/${id}/trash`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error(`Failed to trash message: ${res.statusText}`);
  }

  return res.json();
}
