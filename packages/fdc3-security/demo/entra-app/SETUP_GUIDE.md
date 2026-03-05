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

```
export function getEntraConfig(): EntraConfig {
    return {
        clientId: "62855256-b4f2-406f-9878-be85128aa4f7",
        authority: 'https://login.microsoftonline.com/445c1fc6-7e1e-46dd-8835-9075a151049a',
        redirectUri: 'http://localhost:4006'
    };
}
```

## Step 5: Create Test Users

### Option A: Use Your Admin Account
- You can test with your own Microsoft account (the one you used to create the tenant)

### Option B: Create Test Users (if you have admin rights)
1. Go to "Users" in Entra ID
2. Click "New user"
3. Create test users for your organization

### Option C: Use Personal Microsoft Accounts
- Modify the app registration to support "Personal Microsoft accounts only"
- This allows any Microsoft account to sign in


