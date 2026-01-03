# 🔐 GitHub Actions Secrets Installation Guide

## ✅ Quick Install (Automated)

Run the script to add all secrets:

```bash
export GITHUB_PAT=<your-github-pat>
./scripts/add_github_secrets.sh
```

**Or use GitHub CLI directly:**

```bash
gh secret set CLOUDFLARE_ACCOUNT_ID --repo ceosamprimeaux/meauxCLOUD --body "ede6590ac0d2fb7daf155b35653457b2"
gh secret set CLOUDFLARE_API_TOKEN --repo ceosamprimeaux/meauxCLOUD --body "hFWNgfyv09nhrDH27BW6yYVqLK2y-PhMqJMxBOMA"
# ... (continue with all secrets)
```

---

## 📋 Manual Installation

Go to: **https://github.com/ceosamprimeaux/meauxCLOUD/settings/secrets/actions**

### Core Secrets (Required)

1. **CLOUDFLARE_ACCOUNT_ID**
   ```
   ede6590ac0d2fb7daf155b35653457b2
   ```

2. **CLOUDFLARE_API_TOKEN**
   ```
   hFWNgfyv09nhrDH27BW6yYVqLK2y-PhMqJMxBOMA
   ```

3. **GOOGLE_CLIENT_ID**
   ```
   365932368784-h35rgbm0aqimihjbqqaj1jitpif1cnfu.apps.googleusercontent.com
   ```

4. **GOOGLE_API_KEY**
   ```
   AIzaSyBs5S9tnSIYCMbqp4xaqsnvDBAUGw2ubyk
   ```

5. **GOOGLE_CLIENT_SECRET**
   ```
   <Get from: https://console.cloud.google.com/apis/credentials>
   ```

### Recommended Secrets

6. **RESEND_API_KEY**
   ```
   re_Dkh3uDgE_8j9HKZBHcfFytGWQpSuE8Jtb
   ```

7. **RESEND_WEBHOOK_SECRET**
   ```
   whsec_S3L3dbw9ttxraxfd6/Hrzi636WPfY429
   ```

8. **SUPABASE_URL**
   ```
   https://nkeavhmqvudknofavuid.supabase.co
   ```

9. **SUPABASE_ANON_KEY**
   ```
   sb_publishable_I8YNzmXs2_cT8IkUfjTrng_cJ5HfYQt
   ```

10. **SUPABASE_SERVICE_ROLE_KEY**
    ```
    sb_secret_dCkmJkZ-6-Jng0ChaodPpg_zJ495Lu3
    ```

### Optional Secrets

11. **MESHYAI_API_KEY**
    ```
    msy_CwgKmtLEhYOFrBe7fV0P7B1v2bISUG0PhcwC
    ```

12. **TWILIO_ACCOUNT_SID**
    ```
    <your-twilio-account-sid>
    ```

13. **TWILIO_AUTH_TOKEN**
    ```
    <your-twilio-auth-token>
    ```

### Video/Streaming (If Using)

14. **SFU_APP_ID**
    ```
    <Get from: https://dash.cloudflare.com/?to=/:account/calls>
    ```

15. **SFU_API_TOKEN**
    ```
    <Get from: https://dash.cloudflare.com/?to=/:account/calls>
    ```

16. **TURN_TOKEN_ID**
    ```
    <Get from: https://dash.cloudflare.com/?to=/:account/calls>
    ```

17. **TURN_API_TOKEN**
    ```
    <Get from: https://dash.cloudflare.com/?to=/:account/calls>
    ```

---

## ✅ Verification

After adding secrets, verify they're set:

```bash
gh secret list --repo ceosamprimeaux/meauxCLOUD
```

---

## 🚀 After Installation

1. **Push to main** - Secrets will be available in GitHub Actions
2. **Check Actions** - https://github.com/ceosamprimeaux/meauxCLOUD/actions
3. **Test deployment** - Verify CI/CD works

---

## 📝 Notes

- Secrets are encrypted and only available in GitHub Actions workflows
- They're NOT accessible in GitHub Pages (static hosting)
- For GitHub Pages, use environment detection in HTML (already implemented)
- All API calls from GitHub Pages go to production API (meauxcloud.org)

