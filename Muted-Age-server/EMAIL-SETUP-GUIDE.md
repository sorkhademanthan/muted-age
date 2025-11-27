# Email Service Setup Guide

Choose one of these industry-standard email services for your support ticket notifications.

---

## 🏆 Option 1: Resend (RECOMMENDED)

### Why Resend?
- ✅ **Easiest setup** - No SMTP configuration
- ✅ **Generous free tier** - 100 emails/day, 3,000/month
- ✅ **Modern API** - Built for developers
- ✅ **Great deliverability** - Professional service
- ✅ **Y Combinator backed** - Reliable company

### Setup Steps:

#### 1. Create Resend Account
```bash
# Go to: https://resend.com/signup
# Sign up with your email (free account)
```

#### 2. Get API Key
```bash
# After signup, go to: https://resend.com/api-keys
# Click "Create API Key"
# Copy the key (starts with "re_")
```

#### 3. Install Package
```bash
cd Muted-Age-server
npm install resend
```

#### 4. Update .env File
```env
# Email Service - Resend
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=Muted Age <noreply@yourdomain.com>
ADMIN_EMAIL=admin@yourdomain.com
```

#### 5. Update Support Routes
In `routes/support.js`, change the import:
```javascript
// Old:
const { sendTicketNotification } = require('../utils/emailNotifications');

// New:
const { sendTicketNotification } = require('../utils/emailService-resend');
```

**Done!** ✅ Emails will now be sent via Resend.

---

## 📧 Option 2: SendGrid (Industry Standard)

### Why SendGrid?
- ✅ Used by Uber, Spotify, Airbnb
- ✅ 100 emails/day forever (free)
- ✅ Enterprise-grade reliability
- ⚠️ Requires identity verification (takes 1-2 days)

### Setup Steps:

#### 1. Create SendGrid Account
```bash
# Go to: https://signup.sendgrid.com/
# Sign up (free plan available)
```

#### 2. Verify Your Sender Identity
```bash
# Go to: Settings > Sender Authentication
# Verify your email domain or single sender email
# Wait for verification (can take 24-48 hours)
```

#### 3. Create API Key
```bash
# Go to: Settings > API Keys
# Create new API key with "Mail Send" permissions
# Copy the key (starts with "SG.")
```

#### 4. Install Package
```bash
cd Muted-Age-server
npm install @sendgrid/mail
```

#### 5. Create SendGrid Service File
```javascript
// Create: utils/emailService-sendgrid.js
const sgMail = require('@sendgrid/mail');
const config = require('../config/config');

sgMail.setApiKey(config.email.sendgridApiKey);

const sendEmail = async (to, subject, html) => {
  try {
    await sgMail.send({
      to: to,
      from: config.email.from,
      subject: subject,
      html: html,
    });
    console.log('✅ Email sent via SendGrid');
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
```

#### 6. Update .env File
```env
# Email Service - SendGrid
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

---

## 💰 Option 3: AWS SES (Most Cost-Effective at Scale)

### Why AWS SES?
- ✅ **Cheapest** - $0.10 per 1,000 emails
- ✅ **Highly scalable** - Enterprise-grade
- ⚠️ Requires AWS account setup
- ⚠️ More complex configuration

### Setup Steps:

#### 1. Create AWS Account
```bash
# Go to: https://aws.amazon.com/
# Create account (requires credit card)
```

#### 2. Set Up SES
```bash
# Go to: AWS Console > SES
# Verify your email/domain
# Request production access (starts in sandbox mode)
```

#### 3. Create IAM Credentials
```bash
# Go to: IAM > Users > Create User
# Add permissions: AmazonSESFullAccess
# Create access keys
```

#### 4. Install Package
```bash
cd Muted-Age-server
npm install @aws-sdk/client-ses
```

#### 5. Update .env File
```env
# Email Service - AWS SES
EMAIL_SERVICE=aws_ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
EMAIL_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

---

## 🚀 Quick Comparison

| Feature | Resend | SendGrid | AWS SES |
|---------|--------|----------|---------|
| **Setup Difficulty** | ⭐ Easy | ⭐⭐ Medium | ⭐⭐⭐ Hard |
| **Free Tier** | 3,000/month | 100/day | 62,000/month* |
| **Verification Time** | Instant | 1-2 days | 1-2 days |
| **Cost (per 1K)** | $1.00 | $0.85 | $0.10 |
| **Developer Experience** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Documentation** | Excellent | Good | Complex |
| **Best For** | Startups | Companies | Enterprises |

*AWS SES free tier: First 62,000 emails/month free if sent from EC2

---

## ⚡ Recommended Path

### For Quick Setup (Most Users):
1. **Use Resend** - 5 minutes to set up
2. No verification needed
3. Start sending immediately
4. Upgrade later if needed

### For Production (Serious Projects):
1. **Start with Resend** for development
2. **Switch to SendGrid or AWS SES** for production
3. Both options scale well

---

## 🔧 Current Setup (Without Email Service)

Your support system **already works** without any email service! 

**What happens now:**
- ✅ All ticket operations work perfectly
- ✅ Database saves all data
- ✅ API returns correct responses
- 📧 Email notifications are logged to console instead

**Console output example:**
```
📧 ═══════════════════════════════════════════════════════
📧 EMAIL NOTIFICATION (Console Mode)
📧 ═══════════════════════════════════════════════════════
📧 To: customer@example.com
📧 Subject: Ticket Created: MUTED-2024-0001
📧 Content Preview: Thank you for contacting us...
📧 ═══════════════════════════════════════════════════════
```

This is **perfect for development and testing!**

---

## 📝 Step-by-Step: Enable Resend (5 Minutes)

```bash
# 1. Sign up for Resend
open https://resend.com/signup

# 2. Get API key from dashboard
# Copy the key starting with "re_"

# 3. Install package
cd Muted-Age-server
npm install resend

# 4. Update .env file
echo "RESEND_API_KEY=re_your_key_here" >> .env
echo "EMAIL_FROM=Muted Age <noreply@yourdomain.com>" >> .env

# 5. Update support routes
# Edit routes/support.js line 5:
# Change: require('../utils/emailNotifications')
# To: require('../utils/emailService-resend')

# 6. Restart server
npm run dev

# Done! 🎉
```

---

## 🆘 Troubleshooting

### "Module 'resend' not found"
```bash
cd Muted-Age-server
npm install resend
```

### "Invalid API key"
- Check your .env file
- Ensure key starts with `re_`
- No spaces or quotes in .env

### Emails not arriving
- Check spam folder
- Verify sender email
- Check console for error messages
- Ensure API key has correct permissions

### Want to test without signup?
- Just continue using console logging
- All features work without email
- Set up email service when ready to launch

---

## 💡 Pro Tips

1. **Development:** Use console logging (current setup)
2. **Staging:** Use Resend free tier
3. **Production:** Use SendGrid or AWS SES
4. **Testing:** Create separate API keys for dev/prod
5. **Monitoring:** Check email service dashboards regularly

---

## 📞 Need Help?

- **Resend Docs:** https://resend.com/docs
- **SendGrid Docs:** https://docs.sendgrid.com/
- **AWS SES Docs:** https://docs.aws.amazon.com/ses/

**Support system works perfectly without email - set it up when ready!** 🚀
