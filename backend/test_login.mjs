import axios from 'axios'

const testLogin = async () => {
  try {
    console.log('Testing login endpoint...')
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'ishu@gmail.com',
      password: 'Ishu@123', // You'll need to replace this with actual password
      role: 'User'
    })
    
    console.log('✅ Login successful!')
    console.log('Response:', response.data)
  } catch (error) {
    console.error('❌ Login failed!')
    console.error('Error:', error.response?.data || error.message)
  }
}

testLogin()
