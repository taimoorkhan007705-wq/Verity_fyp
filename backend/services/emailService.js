import nodemailer from 'nodemailer'

// Initialize transporter - will be created dynamically
let transporter = null

// Function to create transporter
const createTransporter = async () => {
  // Try Mailtrap first (most reliable)
  if (process.env.MAILTRAP_USER && process.env.MAILTRAP_PASS) {
    try {
            const mailtrapTransporter = nodemailer.createTransport({
        host: 'live.smtp.mailtrap.io',
        port: 587,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS
        }
      })
      
      // Test Mailtrap
      await new Promise((resolve, reject) => {
        mailtrapTransporter.verify((error, success) => {
          if (error) {
                        reject(error)
          }
          else {
                        resolve(success)
          }
        })
      })
      
      console.log('✅ Email service ready (Mailtrap)')
      return mailtrapTransporter
    } catch (mailtrapError) {
          }
  }
  
  // Try Gmail second if credentials are provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    try {
            const gmailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      })
      
      // Test Gmail
      await new Promise((resolve, reject) => {
        gmailTransporter.verify((error, success) => {
          if (error) {
                        reject(error)
          }
          else {
                        resolve(success)
          }
        })
      })
      
      console.log('✅ Email service ready (Gmail)')
      return gmailTransporter
    } catch (gmailError) {
          }
  }
  
  // Fallback to Ethereal Email for testing
  try {
    const testAccount = await nodemailer.createTestAccount()
    const etherealTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    })
    
    console.log('✅ Email service ready (Test Account - Ethereal)')
        return etherealTransporter
  } catch (error) {
        return null
  }
}

// Initialize transporter on startup
createTransporter().then(t => {
  transporter = t
})

export const sendPasswordResetEmail = async (email, resetToken, resetLink) => {
  try {
    if (!transporter) {
      throw new Error('Email service not initialized. Please try again.')
    }
    
    const mailOptions = {
      from: `"Verity App" <${process.env.EMAIL_USER || 'noreply@verity.app'}>`,
      to: email,
      subject: '🔐 Verity Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #14b8a6; color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; margin: 20px 0; border-radius: 8px; }
            .button { 
              display: inline-block;
              background-color: #14b8a6;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .button:hover { background-color: #0d9488; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
            .warning { background-color: #fee2e2; color: #dc2626; padding: 10px; border-radius: 4px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            
            <div class="content">
              <p>Hi there,</p>
              
              <p>We received a request to reset your password for your Verity account. If you didn't make this request, you can ignore this email.</p>
              
              <p><strong>To reset your password, click the button below:</strong></p>
              
              <center>
                <a href="${resetLink}" class="button">Reset Password</a>
              </center>
              
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; background-color: #fff; padding: 10px; border-left: 4px solid #14b8a6;">
                ${resetLink}
              </p>
              
              <div class="warning">
                ⚠️ <strong>This link expires in 15 minutes.</strong> If it expires, you'll need to request a new password reset.
              </div>
              
              <p style="color: #666; font-size: 14px;">
                <strong>For security reasons:</strong>
                <br>• Never share this link with anyone
                <br>• Verity will never ask for your password via email
                <br>• If you didn't request this, please contact support
              </p>
            </div>
            
            <div class="footer">
              <p>© 2026 Verity. All rights reserved.</p>
              <p>This is an automated email. Please don't reply to this address.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        Hi there,
        
        We received a request to reset your password. Click the link below to proceed:
        
        ${resetLink}
        
        This link expires in 15 minutes.
        
        If you didn't request this, you can ignore this email.
        
        © 2026 Verity
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
        // For test accounts (Ethereal), show preview URL
    const previewUrl = nodemailer.getTestMessageUrl(result)
    if (previewUrl) {
          }
    
    return { success: true, message: 'Email sent successfully', previewUrl }
  } catch (error) {
        return { success: false, error: error.message }
  }
}

export const sendVerificationEmail = async (email, verificationLink) => {
  try {
    const mailOptions = {
      from: `"Verity App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Verify Your Email - Verity',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #14b8a6; color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; margin: 20px 0; border-radius: 8px; }
            .button { 
              display: inline-block;
              background-color: #14b8a6;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .button:hover { background-color: #0d9488; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Verify Your Email</h1>
            </div>
            
            <div class="content">
              <p>Welcome to Verity!</p>
              
              <p>To complete your registration, please verify your email address by clicking the button below:</p>
              
              <center>
                <a href="${verificationLink}" class="button">Verify Email</a>
              </center>
              
              <p>If you didn't create this account, you can safely ignore this email.</p>
            </div>
            
            <div class="footer">
              <p>© 2026 Verity. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
        return { success: true, message: 'Verification email sent' }
  } catch (error) {
        return { success: false, error: error.message }
  }
}

export const sendWelcomeEmail = async (email, fullName) => {
  try {
    const mailOptions = {
      from: `"Verity App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to Verity!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #14b8a6; color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Verity, ${fullName}!</h1>
            </div>
            
            <div class="content">
              <p>Thank you for joining Verity - the platform for verified content sharing.</p>
              
              <p>Your account has been created successfully. You can now:</p>
              <ul>
                <li>Share and verify content</li>
                <li>Connect with other users</li>
                <li>Build your trust score</li>
                <li>Participate in community reviews</li>
              </ul>
              
              <p>If you have any questions, feel free to contact our support team.</p>
            </div>
            
            <div class="footer">
              <p>© 2026 Verity. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
        return { success: true, message: 'Welcome email sent' }
  } catch (error) {
        return { success: false, error: error.message }
  }
}

