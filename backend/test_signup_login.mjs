const API_URL = 'http://localhost:5001/api'

const testSignupAndLogin = async () => {
  try {
    const email = `testuser_${Date.now()}@test.com`
    const password = 'TestPassword123!'
    
    console.log('\n=== TESTING SIGNUP ===')
    console.log('Email:', email)
    console.log('Password:', password)
    
    // Step 1: Signup
    console.log('\n1️⃣ Creating account...')
    const signupResponse = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        email,
        password,
        role: 'User'
      })
    })
    
    const signupData = await signupResponse.json()
    
    if (!signupResponse.ok) {
      console.error('❌ Signup failed!')
      console.error('Error:', signupData)
      return
    }
    
    console.log('✅ Signup successful!')
    console.log('User:', signupData.user)
    console.log('Token:', signupData.token ? 'Received' : 'Not received')
    
    // Step 2: Login
    console.log('\n2️⃣ Logging in...')
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        role: 'User'
      })
    })
    
    const loginData = await loginResponse.json()
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed!')
      console.error('Error:', loginData)
      return
    }
    
    console.log('✅ Login successful!')
    console.log('User:', loginData.user)
    console.log('Token:', loginData.token ? 'Received' : 'Not received')
    console.log('\n=== ALL TESTS PASSED ===')
    console.log('\nYou can now login at http://localhost:5173 with:')
    console.log('Email:', email)
    console.log('Password:', password)
    
  } catch (error) {
    console.error('\n❌ Error!', error.message)
  }
}

testSignupAndLogin()
