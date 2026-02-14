import { NextResponse } from 'next/server'
import Mailjet from 'node-mailjet'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, recaptchaToken } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Verify reCAPTCHA v3
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
    if (recaptchaSecret) {
      if (!recaptchaToken) {
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
      }

      const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
      })
      const recaptchaData = await recaptchaRes.json()

      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
      }
    }

    // Send email via Mailjet
    const mjApiKey = process.env.MAILJET_API_KEY
    const mjApiSecret = process.env.MAILJET_API_SECRET
    const fromEmail = process.env.MAILJET_FROM_EMAIL || 'noreply@devs0.ad'
    const contactEmail = process.env.CONTACT_EMAIL || 'info@conand.ad'

    if (!mjApiKey || !mjApiSecret) {
      console.error('Mailjet API keys not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const mailjet = new Mailjet({ apiKey: mjApiKey, apiSecret: mjApiSecret })

    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: 'CONAND Web',
          },
          To: [
            {
              Email: contactEmail,
              Name: 'CONAND',
            },
          ],
          ReplyTo: {
            Email: email,
            Name: name,
          },
          Subject: subject ? `[CONAND Contact] ${subject}` : `[CONAND Contact] Message from ${name}`,
          TextPart: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`,
          HTMLPart: `
            <h3>New contact form message</h3>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject || 'N/A')}</p>
            <hr />
            <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
          `,
        },
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
