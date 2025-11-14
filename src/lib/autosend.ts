const fetch = require('node-fetch');

const AUTOSEND_API_KEY = process.env.AUTOSEND_API_KEY;
const AUTOSEND_SENDER_EMAIL = process.env.AUTOSEND_SENDER_EMAIL || 'noreply@yourdomain.com';
const AUTOSEND_SENDER_NAME = process.env.AUTOSEND_SENDER_NAME || 'Admissions CRM';

interface EmailPayload {
  to: {
    email: string;
    name?: string;
  };
  from?: {
    email: string;
    name?: string;
  };
  subject: string;
  html: string;
  text?: string;
  replyTo?: {
    email: string;
    name?: string;
  };
  categories?: string[];
}

export async function sendAdminNotificationEmail(
  adminEmail: string,
  leadData: {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
    course?: string;
    message?: string;
    createdAt: string;
  }
) {
  // Don't send if API key not configured
  if (!AUTOSEND_API_KEY) {
    console.warn('AUTOSEND_API_KEY not configured. Skipping email notification.');
    return { success: false, skipped: true };
  }

  try {
    const emailPayload: EmailPayload = {
      to: {
        email: adminEmail,
        name: 'Admin'
      },
      from: {
        email: AUTOSEND_SENDER_EMAIL,
        name: AUTOSEND_SENDER_NAME
      },
      subject: `New Lead Submission - ${leadData.firstName} ${leadData.lastName || ''}`,
      html: generateAdminEmailHTML(leadData),
      text: generateAdminEmailText(leadData),
      replyTo: {
        email: leadData.email
      },
      categories: ['new-lead', 'admin-notification']
    };

    const response = await fetch('https://api.autosend.com/v1/mails/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AUTOSEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Admin notification email sent:', data.data?.emailId);
      return {
        success: true,
        emailId: data.data?.emailId,
        message: 'Email queued successfully'
      };
    } else {
      console.error('Failed to send admin notification:', data.message || 'Unknown error');
      return {
        success: false,
        message: data.message || 'Failed to send email'
      };
    }
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function generateAdminEmailHTML(leadData: {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  course?: string;
  message?: string;
  createdAt: string;
}): string {
  const fullName = `${leadData.firstName} ${leadData.lastName || ''}`.trim();
  const createdDate = new Date(leadData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #0066cc;
            color: white;
            padding: 20px;
            border-radius: 5px 5px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: white;
          }
          .field {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
          }
          .field-label {
            font-weight: bold;
            color: #0066cc;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .field-value {
            color: #333;
            font-size: 14px;
          }
          .action-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #0066cc;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
          .footer {
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Lead Submission</h2>
          </div>
          <div class="content">
            <p>You have received a new lead submission from your website:</p>
            
            <div class="field">
              <div class="field-label">Student Name</div>
              <div class="field-value">${fullName}</div>
            </div>

            <div class="field">
              <div class="field-label">Email Address</div>
              <div class="field-value"><a href="mailto:${leadData.email}">${leadData.email}</a></div>
            </div>

            <div class="field">
              <div class="field-label">Phone Number</div>
              <div class="field-value"><a href="tel:${leadData.phone}">${leadData.phone}</a></div>
            </div>

            ${leadData.course ? `
            <div class="field">
              <div class="field-label">Interested Course</div>
              <div class="field-value">${leadData.course}</div>
            </div>
            ` : ''}

            ${leadData.message ? `
            <div class="field">
              <div class="field-label">Message</div>
              <div class="field-value">${leadData.message}</div>
            </div>
            ` : ''}

            <div class="field">
              <div class="field-label">Submission Date & Time</div>
              <div class="field-value">${createdDate}</div>
            </div>

            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/crm/leads" class="action-button">
              View Lead in CRM
            </a>
          </div>

          <div class="footer">
            <p>This is an automated notification from your Admissions CRM System.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateAdminEmailText(leadData: {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  course?: string;
  message?: string;
  createdAt: string;
}): string {
  const fullName = `${leadData.firstName} ${leadData.lastName || ''}`.trim();
  const createdDate = new Date(leadData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
New Lead Submission

Student Name: ${fullName}
Email: ${leadData.email}
Phone: ${leadData.phone}
${leadData.course ? `Interested Course: ${leadData.course}` : ''}
${leadData.message ? `Message: ${leadData.message}` : ''}
Submission Date: ${createdDate}

View in CRM: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/crm/leads
  `;
}
