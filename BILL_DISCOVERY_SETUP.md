# Bill Discovery Integration Setup

This guide will help you set up the real API integrations for the Bill Discovery feature.

## 🔧 Quick Setup Overview

The Bill Discovery system integrates with:

- **Plaid** for bank account connections and transaction analysis
- **Gmail API** for email bill detection
- **Microsoft Graph** for Outlook email integration

## 📋 Prerequisites

1. **Plaid Account** (for bank integrations)
2. **Google Cloud Project** (for Gmail)
3. **Microsoft Azure App Registration** (for Outlook)

## 🏦 1. Plaid Setup (Bank Integrations)

### Step 1: Create Plaid Account

1. Go to [Plaid Dashboard](https://dashboard.plaid.com)
2. Sign up for a developer account
3. Create a new application

### Step 2: Get Credentials

1. In your Plaid dashboard, go to **Keys** tab
2. Copy your **Client ID** and **Sandbox Secret**
3. Add to `.env.local`:

```env
VITE_PLAID_CLIENT_ID=your_client_id_here
VITE_PLAID_SECRET=your_sandbox_secret_here
```

### Step 3: Configure Products

1. In Plaid dashboard, enable **Transactions** product
2. Set webhook URL (optional): `http://localhost:5173/webhooks/plaid`

## 📧 2. Gmail Integration Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Gmail API** and **Google+ API**

### Step 2: Create OAuth Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. Authorized redirect URIs: `http://localhost:5173/oauth/callback`

### Step 3: Configure OAuth Consent

1. Go to **OAuth consent screen**
2. Fill in application details
3. Add scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

### Step 4: Add Credentials

Add to `.env.local`:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_client_secret_here
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/oauth/callback
```

## 📮 3. Outlook Integration Setup

### Step 1: Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory > App registrations**
3. Click **New registration**

### Step 2: Configure App

1. Name: "BillBuddy"
2. Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
3. Redirect URI: `http://localhost:5173/oauth/callback`

### Step 3: API Permissions

1. Go to **API permissions**
2. Add permissions:
   - **Microsoft Graph > Delegated > Mail.Read**
   - **Microsoft Graph > Delegated > User.Read**

### Step 4: Create Client Secret

1. Go to **Certificates & secrets**
2. Create new client secret
3. Copy the secret value immediately

### Step 5: Add Credentials

Add to `.env.local`:

```env
VITE_MICROSOFT_CLIENT_ID=your_application_id_here
VITE_MICROSOFT_CLIENT_SECRET=your_client_secret_here
VITE_MICROSOFT_REDIRECT_URI=http://localhost:5173/oauth/callback
```

## 🚀 4. Testing the Setup

### Test Bank Connections

1. Go to Bill Discovery page
2. Click "Bank Analysis" tab
3. Click "Connect with Plaid"
4. Use Plaid test credentials:
   - Username: `user_good`
   - Password: `pass_good`

### Test Email Connections

1. Go to "Email Discovery" tab
2. Click "Gmail" or "Outlook"
3. Complete OAuth flow with your real email account
4. Click "Scan" to test bill detection

## 🔒 Security Notes

### Development vs Production

- Current setup uses **Sandbox** mode for Plaid
- For production, upgrade to **Production** Plaid account
- Update redirect URIs to your production domain

### Data Storage

- Currently stores tokens in localStorage for development
- **For production**: Implement secure backend storage
- Use proper encryption for sensitive data
- Implement token refresh mechanisms

### Environment Variables

- Never commit `.env.local` to version control
- Use different credentials for dev/staging/production
- Rotate secrets regularly

## 🛠️ Troubleshooting

### Common Issues

**Plaid Link won't open:**

- Check client ID and secret are correct
- Ensure you're using Sandbox credentials
- Check browser console for errors

**Gmail OAuth fails:**

- Verify redirect URI exactly matches Google Console
- Check scopes are correctly configured
- Ensure Gmail API is enabled

**Outlook OAuth fails:**

- Verify app registration redirect URI
- Check API permissions are granted
- Ensure Microsoft Graph permissions are correct

### Debugging Tips

1. Check browser console for detailed error messages
2. Verify environment variables are loaded correctly
3. Test API endpoints individually
4. Use browser network tab to inspect failed requests

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Test with the example credentials provided by each service
4. Review the API documentation for each service

## 🔄 Next Steps

Once basic integration works:

1. Implement proper error handling
2. Add retry mechanisms for failed API calls
3. Implement secure token storage
4. Add webhook handlers for real-time updates
5. Set up monitoring and logging
6. Implement rate limiting and quota management

The Bill Discovery feature is now ready for testing with real data! 🎉
