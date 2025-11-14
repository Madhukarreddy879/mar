# Email Notification Setup

This guide explains how to set up admin email notifications when students submit lead forms.

## Overview

When a student submits the lead form on the website, the system automatically sends an admin notification email with the student's details. This helps admins stay updated on new inquiries without checking the CRM dashboard.

## Email Service: Autosend

We use **Autosend** as the email service provider. Autosend is a modern email API that's reliable and easy to integrate.

## Setup Instructions

### 1. Get Autosend API Key

1. Go to [Autosend Dashboard](https://app.autosend.com)
2. Sign up for a free account or log in
3. Navigate to **Settings** → **API Keys**
4. Create a new API key (or copy existing one)
5. Copy the API key

### 2. Verify Sender Email Domain

Before sending emails, you need to verify your domain:

1. In Autosend Dashboard, go to **Senders**
2. Add your domain (e.g., `noreply@yourdomain.com`)
3. Follow the verification steps (typically adding DNS records)
4. Once verified, you can use this email as the sender

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Autosend Email Configuration
AUTOSEND_API_KEY="your-api-key-from-autosend"
AUTOSEND_SENDER_EMAIL="noreply@yourdomain.com"  # Your verified domain
AUTOSEND_SENDER_NAME="Admissions CRM"           # Display name
ADMIN_NOTIFICATION_EMAIL="admin@yourdomain.com" # Where to send notifications
```

### 4. Restart Your Application

```bash
npm run dev
```

## How It Works

1. **Form Submission**: Student fills and submits the lead form on the website
2. **Database Save**: Lead is saved to PostgreSQL database
3. **Email Trigger**: Admin notification email is automatically sent (non-blocking)
4. **Email Content**: Email includes:
   - Student's name
   - Email address (clickable mailto link)
   - Phone number (clickable tel link)
   - Course of interest
   - Any message
   - Submission timestamp
   - Direct link to view lead in CRM

## Email Template

The admin notification email is professionally formatted with:
- Clear header identifying it as a new lead
- Well-organized student information
- Direct action button to view the lead in the CRM
- Reply-to address set to student's email for easy communication

## Error Handling

If the email fails to send:
- The system logs the error to console
- **Lead creation still succeeds** (email failure doesn't block form submission)
- Admin can still see the lead in the CRM dashboard

This ensures students aren't blocked from submitting if there's an email service issue.

## Testing

### Send a Test Email

You can test the email integration by:

1. Going to Autosend dashboard and using their test feature
2. Or submitting a test lead via the website form

### Verify Configuration

Check logs in development console:
```
Admin notification email sent: email_xyz789
```

Or if there's an issue:
```
AUTOSEND_API_KEY not configured. Skipping email notification.
```

## Troubleshooting

### "Email not received"
- Check if admin email is spelled correctly in `.env.local`
- Verify Autosend API key is correct
- Check spam/junk folder
- Ensure sender domain is verified in Autosend

### "API Error 401: Unauthorized"
- API key is missing or incorrect
- Copy the key again from Autosend dashboard

### "API Error 429: Rate limit exceeded"
- You've sent too many emails in a short time
- Wait and retry later
- Autosend will indicate when to retry

### "API Error 400: Validation failed"
- Sender email domain is not verified
- Verify domain in Autosend settings first

## Cost

Autosend has a generous free tier:
- First 5,000 emails per month free
- Starts at $10/month for higher volumes
- Perfect for most university admissions use cases

## Production Deployment

When deploying to production (Vercel, etc.):

1. Add environment variables to your deployment platform:
   - Dashboard → Project Settings → Environment Variables
   - Add all `AUTOSEND_*` and `ADMIN_NOTIFICATION_EMAIL` variables

2. Update `NEXTAUTH_URL` to your production domain

3. Update `AUTOSEND_SENDER_EMAIL` and `ADMIN_NOTIFICATION_EMAIL` to your production email addresses

## Email Code Location

- **Email Utility**: `src/lib/autosend.ts`
- **Integration**: `src/app/api/leads/route.ts`
- **Configuration**: `.env.local`

## Future Enhancements

Consider adding:
- Student confirmation emails
- Template-based emails (custom branding)
- Email tracking (open/click rates)
- Scheduled email reminders to follow up on leads
- Bulk email sending to multiple admins
