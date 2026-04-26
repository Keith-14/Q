import { Resend } from 'resend';

const resend = new Resend('re_go1R3wyS_8Mtq29LASukUogZ5ckrtkwTi');

export async function sendThankYouEmail(userEmail: string) {
  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: userEmail,
      subject: 'Welcome to BARAKAH - Thank You for Joining Our Waitlist!',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; padding: 30px;">
            <h1 style="color: #14b8a6; margin-bottom: 20px;">Welcome to BARAKAH</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
              Thank you for joining our waitlist! We're thrilled to have you as part of our community.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
              BARAKAH is your complete Muslim lifestyle companion, bringing together prayer times, community, halal services, and Islamic learning in one beautiful app.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              We'll keep you updated as we prepare to launch. Stay tuned!
            </p>
            <div style="border-top: 1px solid #eee; padding-top: 20px;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Best regards,<br/>
                The BARAKAH Team
              </p>
            </div>
          </div>
        </div>
      `
    });
    
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
