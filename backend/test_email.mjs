import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const testEmail = async () => {
  try {
    console.log('🧪 Testing Email Configuration...\n')
    
    console.log('📧 Email User:', process.env.EMAIL_USER)
    console.log('🔑 Password Configured:', !!process.env.EMAIL_PASSWORD)
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ Email credentials missing in .env')
      process.exit(1)
    }
    
    console.log('\n🔌 Connecting to Gmail...')
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
    
    // Verify connection
    console.log('✅ Verifying connection...')
    await transporter.verify()
    console.log('✅ Connection successful!\n')
    
    // Send test email
    console.log('📤 Sending test email...')
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self
      subject: '🧪 Verity OTP System - Test Email',
      html: `
        <div style="font-family: Arial; text-align: center;">
          <h1>✅ Email System Working!</h1>
          <p>If you received this email, the OTP password reset system is ready to use.</p>
          <div style="background: #f0fdfa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; color: #14b8a6;">Test Code: 123456</p>
          </div>
          <p style="color: #666;">This is an automated test message.</p>
        </div>
      `
    })
    
    console.log('✅ Email sent successfully!')
    console.log('📨 Message ID:', info.messageId)
    console.log('\n🎉 All systems operational!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('\n🔧 Troubleshooting:')
    console.error('1. Check EMAIL_USER and EMAIL_PASSWORD in .env')
    console.error('2. Verify Gmail App Password (16 chars, spaces removed)')
    console.error('3. Enable 2FA on Gmail account')
    console.error('4. Create new App Password at https://myaccount.google.com/apppasswords')
    process.exit(1)
  }
}

testEmail()
