# 🎥 Group Call & AI Assistant Setup

## ✅ What's Been Added

### 1. Group Call Functionality
- **Start Call** button in dashboard
- WebRTC video/audio streaming
- Cloudflare Calls (SFU) integration
- TURN server support for NAT traversal
- Mute/Camera/End Call controls

### 2. Google AI Assistant
- Chat interface in dashboard
- Gemini 2.0 Flash integration
- Real-time AI responses
- Context-aware assistance

---

## 🔧 What You Need

### For Group Calls (SFU)

Your Cloudflare Worker already has these secrets configured:
- ✅ `SFU_APP_ID`
- ✅ `SFU_API_TOKEN`
- ✅ `TURN_TOKEN_ID`
- ✅ `TURN_API_TOKEN`

**Verify they're set:**
```bash
npx wrangler secret list | grep -i sfu
npx wrangler secret list | grep -i turn
```

### For Google AI Assistant

Your Cloudflare Worker already has:
- ✅ `GOOGLE_API_KEY`
- ✅ `AI_GATEWAY_TOKEN`

**Verify:**
```bash
npx wrangler secret list | grep -i google
npx wrangler secret list | grep -i ai_gateway
```

---

## 🧪 Testing Group Calls

### Step 1: Open Dashboard
- Go to: https://ceosamprimeaux.github.io/meauxCLOUD/dashboard.html#/dashboard
- Or: https://meauxcloud.org/dashboard

### Step 2: Start a Call
1. Click **"Start Call"** button
2. Allow camera/microphone permissions
3. Your video should appear
4. Share the link with others to join

### Step 3: Test Controls
- **Mute** - Toggle microphone
- **Camera** - Toggle video
- **End Call** - Stop the call

---

## 🤖 Testing AI Assistant

### Step 1: Open Dashboard
- Navigate to dashboard

### Step 2: Use AI Assistant
1. Type a question in the AI Assistant input
2. Click **"Send"** or press Enter
3. Wait for Gemini response
4. Continue conversation

### Example Questions:
- "What is MeauxCLOUD?"
- "How do I create a project?"
- "Explain the dashboard features"

---

## 🔍 Troubleshooting

### Group Call Issues

**"Failed to start call"**
- Check browser console for errors
- Verify SFU secrets are set in Cloudflare Worker
- Ensure camera/mic permissions granted

**"No video/audio"**
- Check browser permissions
- Verify TURN credentials are correct
- Check network (WebRTC needs stable connection)

### AI Assistant Issues

**"AI assistant unavailable"**
- Check browser console
- Verify `GOOGLE_API_KEY` is set
- Verify `AI_GATEWAY_TOKEN` is set
- Check API quotas in Google Cloud Console

**"No response generated"**
- Check Gemini API status
- Verify API key has correct permissions
- Check Cloudflare AI Gateway logs

---

## 📋 API Endpoints Used

### Group Call
- `POST /api/sfu/session` - Create SFU session
- `GET /api/turn/credentials` - Get TURN server config

### AI Assistant
- `POST /api/google/proxy` - Proxy to Gemini API
- `POST /api/ai/rag` - Advanced RAG queries (optional)

---

## 🚀 Next Steps

1. **Test on GitHub Pages** (dev):
   - https://ceosamprimeaux.github.io/meauxCLOUD/dashboard.html#/dashboard
   - Test group call
   - Test AI assistant

2. **Verify API connections**:
   - Check browser console for errors
   - Verify API calls succeed

3. **Once validated**:
   - Deploy to production
   - Share with team for testing

---

## 💡 Features

### Group Call
- ✅ WebRTC peer-to-peer video
- ✅ Cloudflare Calls SFU support
- ✅ TURN server for NAT traversal
- ✅ Mute/Camera controls
- ✅ Multiple participants (ready for)

### AI Assistant
- ✅ Gemini 2.0 Flash integration
- ✅ Real-time chat interface
- ✅ Context-aware responses
- ✅ Error handling

---

## 📚 Documentation

- **Cloudflare Calls**: https://developers.cloudflare.com/calls/
- **Google Gemini API**: https://ai.google.dev/docs
- **WebRTC**: https://webrtc.org/

