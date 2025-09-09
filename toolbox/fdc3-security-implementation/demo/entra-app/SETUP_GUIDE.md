# Microsoft Entra ID Free Setup Guide for FDC3 Demo

This guide will help you set up the FDC3 Microsoft Entra integration using your free Entra ID subscription.

## Prerequisites

- Microsoft Entra ID Free subscription
- Access to Azure Portal
- Admin rights to create app registrations

## Step 1: Create App Registration

1. **Go to Azure Portal**
   - Navigate to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Microsoft account

2. **Access Entra ID**
   - Search for "Entra ID" in the search bar
   - Click on "Microsoft Entra ID"

3. **Create New App Registration**
   - Click "App registrations" in the left menu
   - Click "New registration"
   - Fill in the details:
     - **Name**: `FDC3 Security Demo`
     - **Supported account types**: `Accounts in this organizational directory only`
     - **Redirect URI**: `Web` - `http://localhost:4006`
   - Click "Register"

4. **Note Your Credentials**
   - Copy the **Application (client) ID** - you'll need this
   - Copy the **Directory (tenant) ID** - you'll need this

## Step 2: Configure Authentication

1. **Add Redirect URI**
   - In your app registration, go to "Authentication"
   - Under "Single-page application", click "Add URI"
   - Add: `http://localhost:4006`
   - Click "Save"

2. **Configure Implicit Grant**
   - In the same Authentication page
   - Under "Implicit grant and hybrid flows"
   - Check "ID tokens (used for implicit and hybrid flows)"
   - Click "Save"

## Step 3: Set API Permissions

1. **Add Microsoft Graph Permissions**
   - Go to "API permissions"
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Choose "Delegated permissions"
   - Find and select "User.Read"
   - Click "Add permissions"

2. **Grant Admin Consent** (if needed)
   - Click "Grant admin consent for [Your Organization]"
   - Confirm the action

## Step 4: Configure Your FDC3 App

1. **Update Environment Variables**
   Create a `.env` file in the entra-app directory:
   ```bash
   ENTRA_CLIENT_ID=your-application-client-id-here
   ENTRA_AUTHORITY=https://login.microsoftonline.com/your-tenant-id-here
   ENTRA_REDIRECT_URI=http://localhost:4006
   ```

2. **Or Update Code Directly**
   In `client/src/entra.ts`, replace:
   ```typescript
   clientId: process.env.ENTRA_CLIENT_ID || 'YOUR_CLIENT_ID',
   authority: process.env.ENTRA_AUTHORITY || 'https://login.microsoftonline.com/YOUR_TENANT_ID',
   ```

## Step 5: Test Users

### Option A: Use Your Admin Account
- You can test with your own Microsoft account (the one you used to create the tenant)

### Option B: Create Test Users (if you have admin rights)
1. Go to "Users" in Entra ID
2. Click "New user"
3. Create test users for your organization

### Option C: Use Personal Microsoft Accounts
- Modify the app registration to support "Personal Microsoft accounts only"
- This allows any Microsoft account to sign in

## Step 6: Run the Demo

1. **Install Dependencies**
   ```bash
   cd /Users/rob/Documents/finos/fdc3-general/FDC3/toolbox/fdc3-security-implementation
   npm install
   ```

2. **Start the Entra App**
   ```bash
   npm run start:entra-app
   ```

3. **Open Browser**
   - Navigate to `http://localhost:4006`
   - Click "Log In with Microsoft"
   - Sign in with your Microsoft account

## Troubleshooting

### Common Issues

1. **"AADSTS50011: The reply URL specified in the request does not match"**
   - Solution: Make sure the redirect URI in Azure matches exactly: `http://localhost:4006`

2. **"AADSTS65001: The user or administrator has not consented"**
   - Solution: Grant admin consent for the User.Read permission

3. **"AADSTS70011: The provided value for the 'scope' parameter is not valid"**
   - Solution: Make sure you're requesting the correct scopes: `['User.Read']`

### Debug Tips

1. **Check Browser Console**
   - Look for authentication errors
   - Check network requests to Microsoft

2. **Verify Configuration**
   - Double-check client ID and tenant ID
   - Ensure redirect URI matches exactly

3. **Test with Different Accounts**
   - Try with your admin account first
   - Then test with other users in your tenant

## What You'll See

When working correctly, you should see:
- Microsoft login popup when clicking "Log In with Microsoft"
- Successful authentication with your Microsoft account
- User information displayed in the FDC3 app
- Real JWT tokens being used for FDC3 security operations

## Limitations with Free Tier

- **User Limit**: Up to 50,000 users in your tenant
- **App Registrations**: Up to 10 app registrations
- **No Multi-tenant**: Limited to your organization only
- **Basic Security**: No advanced security features

But for the FDC3 demo, this is more than sufficient!
