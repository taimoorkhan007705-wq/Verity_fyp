import nodemailer from 'nodemailer'

// Test Gmail OTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'taimoorkhan007705@gmail.com',
    pass: 'tlioizdxxeorpsbv'
  }
})

console.log('\n[TEST] Verifying Gmail OTP Transporter...')
console.log('[TEST] Email:', 'taimoorkhan007705@gmail.com')
console.log('[TEST] Password:', 'tlioizdxxeorpsbv')

transporter.verify((error, success) => {
  if (error) {
    console.log('\n❌ FAILED:')
    console.log(error.message)
    console.log('\n⚠️ POSSIBLE SOLUTIONS:')
    console.log('1. Gmail app password is incorrect (should be 16 chars, no spaces)')
    console.log('2. 2-Step verification not enabled on Google Account')
    console.log('3. App password not created in Gmail settings')
    console.log('4. Try regenerating the app password')
    process.exit(1)
  } else {
    console.log('\n✅ SUCCESS!')
    console.log('Gmail OTP service is configured correctly')
    
    // Send test OTP
    const mailOptions = {
      from: 'taimoorkhan007705@gmail.com',
      to: 'taimoorkhan007705@gmail.com',
      subject: '🔐 OTP Test - Verity Password Reset',
      html: `
        <div style="text-align: center; padding: 40px;">
          <h1>🔐 Password Reset Test</h1>
          <div style="font-size: 48px; font-weight: bold; letter-spacing: 8px; color: #14b8a6; margin: 30px 0;">
            123456
          </div>
          <p>This is a test OTP for Verity password reset system.</p>
          <p style="color: #ef4444;">⏰ Expires in 10 minutes</p>
        </div>
      `
    }
    
    console.log('\n[TEST] Sending test OTP to:', mailOptions.to)
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('\n❌ EMAIL SEND FAILED:')
        console.log(error.message)
        process.exit(1)
      } else {
        console.log('\n✅ EMAIL SENT SUCCESSFULLY!')
        console.log('Message ID:', info.messageId)
        console.log('Response:', info.response)
        console.log('\n📧 Check your Gmail inbox for the test email')
        process.exit(0)
      }
    })
  }
})
