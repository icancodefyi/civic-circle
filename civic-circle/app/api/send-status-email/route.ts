import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // use SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email template generator
const generateEmailHTML = (
  reportTitle: string,
  reportId: number,
  oldStatus: string,
  newStatus: string,
  reporterName: string
) => {
  const statusColors: Record<string, string> = {
    PENDING: '#f59e0b',
    IN_PROGRESS: '#3b82f6',
    RESOLVED: '#10b981',
    REJECTED: '#ef4444',
    CLOSED: '#6b7280',
  };

  const statusColor = statusColors[newStatus] || '#6b7280';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Status Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">CivicCircle</h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">Community Report Management System</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                Hello ${reporterName},
              </h2>

              <!-- Status Update Message -->
              <div style="background-color: #f9fafb; border-left: 4px solid ${statusColor}; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                  The status of your report has been updated by our municipal team:
                </p>
                <h3 style="margin: 15px 0 10px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                  "${reportTitle}"
                </h3>
                <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
                  Report ID: #${reportId}
                </p>
              </div>

              <!-- Status Change Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                <tr>
                  <td style="padding: 15px; background-color: #fef2f2; border-radius: 8px; text-align: center; width: 45%;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Previous Status</p>
                    <p style="margin: 0; color: #991b1b; font-size: 16px; font-weight: 600;">${oldStatus.replace('_', ' ')}</p>
                  </td>
                  <td style="width: 10%; text-align: center;">
                    <span style="color: #9ca3af; font-size: 24px;">→</span>
                  </td>
                  <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px; text-align: center; width: 45%;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Current Status</p>
                    <p style="margin: 0; color: ${statusColor}; font-size: 16px; font-weight: 600;">${newStatus.replace('_', ' ')}</p>
                  </td>
                </tr>
              </table>

              <!-- Status Explanation -->
              <div style="margin: 25px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">What does this mean?</h4>
                <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.8;">
                  ${getStatusExplanation(newStatus)}
                </p>
              </div>

              <!-- Call to Action -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reports/${reportId}" 
                   style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);">
                  View Report Details
                </a>
              </div>

              <!-- Footer Message -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                  <strong>💡 Tip:</strong> You can track all your reports and see real-time updates by logging into your CivicCircle account.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Thank you for helping improve our community! 🏙️
              </p>
              <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                This is an automated notification from CivicCircle.<br>
                Please do not reply to this email.
              </p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                  © ${new Date().getFullYear()} CivicCircle. All rights reserved.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const getStatusExplanation = (status: string): string => {
  const explanations: Record<string, string> = {
    PENDING: '⏳ Your report has been received and is awaiting review by our municipal team. We will assess the issue and take appropriate action soon.',
    IN_PROGRESS: '🔧 Great news! Our team is actively working on resolving this issue. We appreciate your patience as we address your concern.',
    RESOLVED: '✅ Excellent! The issue reported has been successfully resolved. Thank you for bringing this to our attention and helping improve our community.',
    REJECTED: '❌ After careful review, we were unable to proceed with this report. This may be due to insufficient information, duplication, or the issue being outside our jurisdiction. Please feel free to submit additional details if needed.',
    CLOSED: '📁 This report has been closed. If you believe this issue requires further attention, please submit a new report with updated information.',
  };

  return explanations[status] || 'Your report status has been updated. Please check the report details for more information.';
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, reportTitle, oldStatus, newStatus, reporterName, reporterEmail } = body;

    // Validate required fields
    if (!reportId || !reportTitle || !oldStatus || !newStatus || !reporterName || !reporterEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email credentials not configured. Skipping email notification.');
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email credentials not configured. Notification skipped.',
          warning: true 
        },
        { status: 200 }
      );
    }

    // Create transporter
    const transporter = createTransporter();

    // Generate email HTML
    const emailHTML = generateEmailHTML(reportTitle, reportId, oldStatus, newStatus, reporterName);

    // Email options
    const mailOptions = {
      from: {
        name: 'CivicCircle',
        address: process.env.SMTP_USER || '',
      },
      to: reporterEmail,
      subject: `📬 Report Status Update: ${reportTitle}`,
      html: emailHTML,
      text: `Hello ${reporterName},

The status of your report "${reportTitle}" (ID: #${reportId}) has been updated.

Previous Status: ${oldStatus.replace('_', ' ')}
Current Status: ${newStatus.replace('_', ' ')}

${getStatusExplanation(newStatus).replace(/<[^>]*>/g, '')}

View your report at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reports/${reportId}

Thank you for helping improve our community!

- CivicCircle Team
`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Email notification sent successfully',
    });

  } catch (error) {
    console.error('Error sending status update email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email notification', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
