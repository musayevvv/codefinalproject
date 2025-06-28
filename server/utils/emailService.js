import nodemailer from 'nodemailer';

// Configure the SMTP transporter

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // və ya 465 (secure:true)
  secure: false, // 587 üçün false, 465 üçün true
  auth: {
    user: 'aykhanfm-af107@code.edu.az', // Brevo tərəfindən verilmiş SMTP email
    pass: 'nfuwyokjtixkhfju',              // Brevo SMTP üçün API açarı (şifrə deyil!)
  },
});

// Function to send email
export async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: '90c1b5002@smtp-brevo.com',
      to,
      subject,
      text,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}
