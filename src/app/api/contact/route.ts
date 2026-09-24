import { NextResponse } from 'next/server';
import { z } from 'zod';
const optional = (max: number) => z.string().trim().max(max).optional().default('');
const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  subject: optional(200),
  message: optional(5000),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^$|^[+0-9()./ -]{6,40}$/)
    .optional()
    .default(''),
  company: optional(200),
  service: optional(200),
  topics: optional(500),
  preferredDate: z
    .string()
    .regex(/^$|^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .default(''),
  kind: z.enum(['contact', 'quote', 'newsletter']).optional().default('contact'),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});
const requests = new Map<string, { count: number; expires: number }>();
export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin && origin !== process.env.NEXT_PUBLIC_SITE_URL)
    return NextResponse.json({ code: 'INVALID_ORIGIN' }, { status: 403 });
  if (Number(req.headers.get('content-length') || 0) > 20000)
    return NextResponse.json({ code: 'CONTENT_TOO_LONG' }, { status: 413 });
  let body;
  try {
    const text = await req.text();
    if (text.length > 20000)
      return NextResponse.json({ code: 'CONTENT_TOO_LONG' }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ code: 'INVALID_INPUT' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ code: 'INVALID_INPUT' }, { status: 400 });
  const { kind, website: _website, ...fields } = parsed.data;
  // Quote and contact forms collect structured fields; compose the required subject/message.
  const details = [
    fields.company && `Company: ${fields.company}`,
    fields.phone && `Phone: ${fields.phone}`,
    fields.service && `Service: ${fields.service}`,
    fields.preferredDate && `Preferred date: ${fields.preferredDate}`,
    fields.topics && `Topics: ${fields.topics}`,
  ].filter(Boolean);
  const subject =
    fields.subject ||
    (kind === 'quote'
      ? `Quote request${fields.service ? ` – ${fields.service}` : ''}`
      : kind === 'newsletter'
        ? 'Newsletter subscription'
        : `Website enquiry${fields.topics ? ` – ${fields.topics}` : ''}`);
  const message = [fields.message, ...details].filter(Boolean).join('\n');
  const payload = {
    ...fields,
    subject: subject.slice(0, 200),
    message: (message.length >= 10 ? message : `${subject}\n${message}`).slice(0, 5000),
  };
  const key = payload.email.toLowerCase();
  const now = Date.now();
  for (const [k, v] of requests) if (v.expires < now) requests.delete(k);
  const limit = requests.get(key);
  if (limit && limit.count >= 3)
    return NextResponse.json({ code: 'RATE_LIMITED' }, { status: 429 });
  requests.set(key, { count: (limit?.count || 0) + 1, expires: limit?.expires || now + 600000 });
  try {
    const res = await fetch(
      `${process.env.STRAPI_URL || 'http://localhost:1337'}/api/site-inquiry`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-inquiry-secret': process.env.INQUIRY_SECRET || '',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!res.ok) throw new Error('CMS rejected inquiry');
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ code: 'UNAVAILABLE' }, { status: 503 });
  }
}
