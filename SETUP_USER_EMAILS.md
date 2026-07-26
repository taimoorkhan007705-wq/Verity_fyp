# SETUP USER EMAILS - ACTION GUIDE

**Status**: Backend ready for multi-email OTP ✅

---

## QUICK START

### Step 1: Get Gmail App Password

For EACH user/reviewer/business that wants to use their own email:

1. **Go to**: https://myaccount.google.com/apppasswords
2. **Login** to the Gmail account
3. **Select**: Mail + Windows Computer (or appropriate device)
4. **Google generates**: 16-character password
5. **Copy**: The password (spaces can be ignored: `tlioizdxxeorpsbv`)

### Step 2: Add to Database

Choose ONE method:

#### **Method A: MongoDB Compass (GUI)**

1. **Open**: MongoDB Compass
2. **Connect to**: `mongodb+srv://taimoorkhan:th7071705@cluster0.cdtghag.mongodb.net`
3. **Go to**: Database → `cluster0` → Collection → `users`
4. **Find** user by email
5. **Click** edit button (pencil icon)
6. **Find** field (create if doesn't exist):
   ```json
   {
     "_id": ObjectId(...),
     "email": "test@gmail.com",
     ...
     "emailConfig": {
       "email": "test@gmail.com",
       "password": "testapppassword",
       "configuredAt": { "$date": "2024-07-26T12:00:00.000Z" }
     }
   }
   ```
7. **Save**

#### **Method B: MongoDB Shell Script**

Create file `add_user_email.mjs`:

```javascript
import { MongoClient } from 'mongodb'

const uri = 'mongodb+srv://taimoorkhan:th7071705@cluster0.cdtghag.mongodb.net'
const client = new MongoClient(uri)

async function addEmailConfig() {
  try {
    await client.connect()
    const db = client.db('cluster0')
    
    // Example: Add email to user
    const userEmail = 'test@gmail.com'
    const gmailAppPassword = 'testapppassword'
    
    const result = await db.collection('users').updateOne(
      { email: userEmail },
      {
        $set: {
          'emailConfig.email': userEmail,
          'emailConfig.password': gmailAppPassword,
          'emailConfig.configuredAt': new Date()
        }
      }
    )
    
    if (result.modifiedCount > 0) {
      console.log(`✅ Updated ${userEmail}`)
    } else {
      console.log(`❌ User not found: ${userEmail}`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.close()
  }
}

addEmailConfig()
```

Run: `node add_user_email.mjs`

#### **Method C: Update Multiple Users**

For Reviewers collection:

```javascript
import { MongoClient } from 'mongodb'

const uri = 'mongodb+srv://taimoorkhan:th7071705@cluster0.cdtghag.mongodb.net'
const client = new MongoClient(uri)

async function addAllReviewerEmails() {
  try {
    await client.connect()
    const db = client.db('cluster0')
    
    // Example data for multiple reviewers
    const reviewers = [
      { email: 'reviewer1@gmail.com', password: 'reviewer1password' },
      { email: 'reviewer2@gmail.com', password: 'reviewer2password' },
      { email: 'reviewer3@gmail.com', password: 'reviewer3password' }
    ]
    
    for (const reviewer of reviewers) {
      const result = await db.collection('reviewers').updateOne(
        { email: reviewer.email },
        {
          $set: {
            'emailConfig.email': reviewer.email,
            'emailConfig.password': reviewer.password,
            'emailConfig.configuredAt': new Date()
          }
        }
      )
      
      console.log(`${result.modifiedCount > 0 ? '✅' : '❌'} ${reviewer.email}`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

addAllReviewerEmails()
```

---

## VERIFICATION

### Check if Email Config Added

```javascript
import { MongoClient } from 'mongodb'

const uri = 'mongodb+srv://taimoorkhan:th7071705@cluster0.cdtghag.mongodb.net'
const client = new MongoClient(uri)

async function checkEmailConfig() {
  try {
    await client.connect()
    const db = client.db('cluster0')
    
    const user = await db.collection('users').findOne(
      { email: 'test@gmail.com' },
      { projection: { email: 1, 'emailConfig.email': 1 } }
    )
    
    if (user) {
      console.log('User:', user.email)
      console.log('Email Config:', user.emailConfig?.email || 'Not configured')
    } else {
      console.log('User not found')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

checkEmailConfig()
```

---

## TESTING OTP WITH USER EMAILS

### Test Case 1: User with Email Config

1. **Setup**: Add user email config to database
2. **Request**: OTP for that user
3. **Expected**: OTP sent from user's email ✅
4. **Check**: Backend logs should show "Using user's own email"

### Test Case 2: User without Email Config

1. **Setup**: No email config for user
2. **Request**: OTP for that user
3. **Expected**: OTP sent from fallback (taimoorkhan007705@gmail.com) ✅
4. **Check**: Backend logs should show "Using main account"

### Test Case 3: Multiple Users

1. **Setup**: Add different email configs to different users
2. **Request**: OTP for User A, then User B, then User C
3. **Expected**: Each gets OTP from their own email ✅
4. **Check**: Each email inbox receives their OTP

---

## EXAMPLE SETUP

### Setup 3 Users with Their Own Emails

```bash
# User 1: Uses their own email
User: test1@gmail.com
Gmail App Password: test1apppassword
Database: emailConfig.email = "test1@gmail.com"
Result: OTP from test1@gmail.com ✅

# User 2: Uses their own email
User: test2@gmail.com
Gmail App Password: test2apppassword
Database: emailConfig.email = "test2@gmail.com"
Result: OTP from test2@gmail.com ✅

# User 3: No email config (uses fallback)
User: test3@gmail.com
Database: emailConfig = null or not set
Result: OTP from taimoorkhan007705@gmail.com ✅
```

---

## TROUBLESHOOTING

### OTP Still Going to Main Account

**Cause**: Email config not saved to database

**Fix**:
1. Verify email config exists in database:
   ```javascript
   db.users.findOne({ email: 'your@email.com' }, { projection: { emailConfig: 1 } })
   ```
2. If not there, add it using one of the methods above
3. Restart backend
4. Try again

### OTP Not Received

**Cause**: Gmail app password incorrect or 2FA not enabled

**Fix**:
1. Verify Gmail app password (16 characters)
2. Check Gmail account has 2FA enabled
3. Try with fresh app password
4. Update database with new password

### "Invalid login" Error in Backend Logs

**Cause**: Gmail credentials wrong or 2FA issues

**Fix**:
1. Generate new app password from: https://myaccount.google.com/apppasswords
2. Update database with new password
3. Verify spaces are removed: `tlioizdxxeorpsbv` (not `tlio izdx xeor psbv`)

---

## SUMMARY

✅ **Backend**: Multi-email OTP system ready  
✅ **Database**: emailConfig field added to all models  
✅ **Fallback**: Uses main account if user email fails  
✅ **Ready**: For users to add their own emails  

**Next**: Add user email configs to database → Test OTP → Deploy!

---

**System Ready for Multi-Email OTP!** 🚀
