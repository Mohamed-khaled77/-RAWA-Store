import nodemailer from "nodemailer";

export async function sendOrderConfirmationEmail(
  userEmail: string,
  userName: string,
  orderId: string,
  total: number
) {
  // If no email is provided (since we mostly use phone numbers), we can mock or skip
  if (!userEmail || !userEmail.includes("@")) {
    console.log("No valid email provided, skipping order email.");
    return;
  }

  try {
    // We use a mock configuration if environment variables are not set.
    // Replace with real SMTP credentials in production.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || "your-email@gmail.com", 
        pass: process.env.SMTP_PASS || "your-app-password",
      },
    });

    const mailOptions = {
      from: '"Rawa Store" <noreply@rawastore.com>',
      to: userEmail,
      subject: `تأكيد طلبك من متجر روا - الطلب رقم #${orderId.slice(0, 8)}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6a1b9a;">مرحباً ${userName}،</h2>
          <p>شكراً لطلبك من متجر روا!</p>
          <p>لقد استلمنا طلبك بنجاح وجاري تجهيزه الآن.</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>رقم الطلب:</strong> #${orderId}<br/>
            <strong>الإجمالي:</strong> ${total} جنيه<br/>
            <strong>طريقة الدفع:</strong> الدفع عند الاستلام
          </div>
          <p>سنتواصل معك قريباً لتأكيد موعد التسليم.</p>
          <br/>
          <p>مع تحيات،<br/><strong>فريق متجر روا</strong></p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
