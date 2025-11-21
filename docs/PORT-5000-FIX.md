# Port 5000 Fix - macOS AirPlay Issue

## Problem
Port 5000 is being used by Apple's AirPlay Receiver on macOS, preventing the backend server from starting.

## Solution Options

### Option 1: Disable AirPlay Receiver (Recommended)

1. Open **System Settings** (or System Preferences on older macOS)
2. Go to **General** → **AirDrop & Handoff** (or **Sharing** on older versions)
3. Turn OFF **AirPlay Receiver**

### Option 2: Change Backend Port

If you want to keep AirPlay enabled, change the backend port:

1. Edit `.env` file:
```bash
PORT=5001
```

2. Update frontend API URL (if using React):
```javascript
// In your React app's .env or config
REACT_APP_API_URL=http://localhost:5001
```

3. Restart the server

---

## Quick Test

After fixing, test with:

```bash
curl http://localhost:5000/api/health
# or if you changed port:
curl http://localhost:5001/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Muted Age Backend Server is running!",
  "environment": "development",
  "timestamp": "..."
}
```
