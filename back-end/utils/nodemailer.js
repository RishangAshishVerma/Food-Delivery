
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify transporter
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Mail transporter error:", error);
    } else {
        console.log("✅ Mail transporter ready to send emails");
    }
});

// sendmail function
export const sendmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Food Delivery" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("✅ Email sent successfully:", info.messageId);
        console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("❌ Error while sending mail:", err);
    }
};
