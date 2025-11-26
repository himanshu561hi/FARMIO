const sgMail = require('@sendgrid/mail'); // Nodemailer ki jagah SendGrid package

// API Key Config (HTTPS connection ke liye)
sgMail.setApiKey(process.env.EMAIL_PASS);

const sendEmail = async (options) => {
  try {
    // 1. Email Options Object (Purana logic same hai)
    const mailOptions = {
      from: process.env.SENDER_EMAIL, // SendGrid par verify kiya hua email
      to: options.email,
      subject: options.subject,
      html: options.message, // HTML content same rahega
    };

    // 2. Send Email (HTTPS request via SendGrid)
    await sgMail.send(mailOptions);
    
    console.log(`Email sent successfully to: ${options.email}`);
  } catch (error) {
    console.error("SendGrid Error:", error);
    if (error.response) {
      console.error(error.response.body);
    }
    // Error throw karna zaruri hai taaki controller ko pata chale ki fail hua
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;