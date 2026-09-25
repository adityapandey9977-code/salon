import nodemailer from 'nodemailer';

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'adityapandey9977@gmail.com',
      pass: 'pyhn rkqf rkwx cjfu',
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"  Salon SaaS" <adityapandey9977@gmail.com>',
      to: 'adityapandey99777@gmail.com',
      subject: '  Franchise Partner Access Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f0ff;">
          <h2 style="color: #5A2EA6;">  Salon & Spa SaaS — Franchise Partner Credentials</h2>
          <p>Hello Rohan Prajapati,</p>
          <p>Your Franchise Partner Account has been activated.</p>
          <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #d8b4fe;">
            <p><strong>Login Portal:</strong> <a href="http://localhost:5173/franchise/login">http://localhost:5173/franchise/login</a></p>
            <p><strong>Login Email:</strong> adityapandey99777@gmail.com</p>
            <p><strong>Auto-Generated Password:</strong> <code style="color: #7c3aed; font-weight: bold;">Franchise@2026!7A2F</code></p>
          </div>
        </div>
      `,
    });
    console.log('TEST EMAIL SENT SUCCESSFULLY:', info.messageId);
  } catch (err) {
    console.error('FAILED TO SEND TEST EMAIL:', err);
  }
}

testEmail();
