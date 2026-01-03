# Setting Up Google Cloud for OAuth and Gemini API

To enable specialized Google Login and full access to Gemini features for your MeauxOS Dashboard, follow these steps to set up your Google Cloud Project.

## 1. Create a Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top bar and select **"New Project"**.
3. Name it `MeauxOS-Production` (or similar).
4. Click **Create** and wait for it to initialize.

## 2. Configure OAuth Consent Screen
1. In the left sidebar, navigate to **APIs & Services > OAuth consent screen**.
2. Select **External** (unless you have a Google Workspace organization, then Internal is fine).
3. Fill in the app details:
   - **App Name:** MeauxOS
   - **User Support Email:** Your email
   - **Developer Contact Info:** Your email
4. Click **Save and Continue**.
5. **Scopes:** Click "Add or Remove Scopes". Select `userinfo.email` and `userinfo.profile`.
6. **Test Users:** Add your own email address to test the login before verification.

## 3. Create Credentials (OAuth Client ID)
1. Go to **APIs & Services > Credentials**.
2. Click **+ Create Credentials** and select **OAuth client ID**.
3. **Application Type:** Web application.
4. **Name:** `MeauxOS-Web-Client`.
5. **Authorized JavaScript Origins:**
   - `https://meauxcloud.org`
   - `https://www.meauxcloud.org`
   - `https://meauxcloud.meauxbility.workers.dev`
   - `http://localhost:5173` (for local development)
6. **Authorized Redirect URIs:**
   - `https://meauxcloud.org/api/auth/callback/google`
   - `https://meauxcloud.meauxbility.workers.dev/api/auth/callback/google`
7. Click **Create**.
8. **IMPORTANT:** Copy your **Client ID** and **Client Secret**. You will need to save these in your Cloudflare Worker later.

## 4. Enable APIs (Gemini & Others)
1. Go to **APIs & Services > Library**.
2. Search for **"Google Generative AI API"** (or Vertex AI if you are using that).
3. Click **Enable**.
4. Search for other APIs you might need (e.g., Google Drive API, Gmail API) and enable them if your "MCP" tools need them.

## 5. Deployment
Once you have your Client ID and Secret:
1. Run this command to save them to your worker:
   ```bash
   npx wrangler secret put GOOGLE_CLIENT_ID
   npx wrangler secret put GOOGLE_CLIENT_SECRET
   ```
2. Your worker will handle the OAuth flow using these secrets.
