# Forgot Password Feature - Setup Guide

## 🎉 Implementation Complete!

The forgot password feature with email integration has been successfully implemented.

## ✅ What's Been Implemented:

### Frontend Components:
1. **Login Page (`src/pages/Login.tsx`)**
   - Added "Forgot Password?" button
   - Modal for entering email to request password reset
   - Sends reset link via email

2. **Reset Password Page (`src/pages/ResetPassword.tsx`)**
   - New page for users to set a new password
   - Validates reset token from URL
   - Shows success message after password reset
   - Redirects to login page

3. **App Routes (`src/App.tsx`)**
   - Added `/reset-password` route

### Backend:
1. **Database**
   - Added `reset_token` and `reset_token_expires` columns to users table
   - Migration file: `backend/add_password_reset_tokens.sql`

2. **API Endpoints (`backend/index.ts`)**
   - `POST /api/auth/forgot-password` - Generates reset token and sends email
   - `POST /api/auth/reset-password` - Validates token and updates password

3. **Email Service**
   - Integrated nodemailer for Gmail SMTP
   - HTML email template with reset link

## 📧 Email Configuration Setup:

To enable the email functionality, you need to configure your Gmail credentials:

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com
2. Navigate to **Security**
3. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter "Finance Tracker" as the name
5. Click **Generate**
6. Copy the 16-character password (something like: `xxxx xxxx xxxx xxxx`)

### Step 3: Update .env File
1. Open `backend/.env`
2. Replace the placeholder values:
   ```env
   EMAIL_USER=your-actual-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```

### Step 4: Restart Backend Server
Stop and restart your backend server to load the new environment variables:
```bash
cd backend
npm run dev
```

## 🚀 How to Use:

### For Users:
1. **Request Password Reset:**
   - Go to the Login page
   - Click "Forgot Password?" button
   - Enter your email address
   - Click "Send Reset Link"
   - Check your email inbox

2. **Reset Password:**
   - Open the email and click the reset link
   - You'll be redirected to the Reset Password page
   - Enter your new password (minimum 6 characters)
   - Confirm the password
   - Click "Reset Password"
   - You'll be redirected to login

### Password Reset Flow:
```
Login Page → Forgot Password → Enter Email → Receive Email 
   → Click Link → Reset Password Page → Set New Password → Success → Login
```

## 🔒 Security Features:

- Reset tokens expire after 1 hour
- Tokens are randomly generated using crypto
- Passwords are hashed with bcrypt before storage
- Token is removed from database after successful reset
- Email validation required
- Password minimum length: 6 characters

## 🧪 Testing:

1. Make sure backend server is running
2. Configure email credentials in `.env`
3. Go to http://localhost:5177/login
4. Click "Forgot Password?"
5. Enter a registered email
6. Check your email for the reset link
7. Click the link and set a new password
8. Login with the new password

## 📝 Note:

- The reset link is valid for 1 hour
- Users must have a registered email in the system
- Make sure to use an App Password, not your regular Gmail password
- The email will be sent from the configured Gmail account

## ⚠️ Important:

**Don't commit your actual email credentials to version control!**

Add `.env` to your `.gitignore` file if not already there.

## 🎨 UI Features:

- Beautiful gradient modals
- Loading states during email sending
- Success/error messages
- Show/hide password toggles
- Responsive design
- Smooth transitions

---

Enjoy your fully functional password reset feature! 🎉
