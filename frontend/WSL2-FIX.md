# WSL2 Networking Fix After Reboot

## The Issue
After rebooting, WSL2 often has networking issues where:
- Ports don't forward properly to Windows
- localhost doesn't work from Windows browser
- Services can't bind to ports correctly

## Quick Fixes to Try:

### 1. Restart WSL2 completely
```bash
# In Windows PowerShell (as Administrator):
wsl --shutdown
wsl

# Then restart your terminal and try again
```

### 2. Check WSL2 IP address
```bash
# In WSL2:
hostname -I
# Note the IP address (usually 172.x.x.x)
```

### 3. Clear Next.js cache and restart
```bash
cd frontend
rm -rf .next
rm -rf node_modules/.cache
npm run dev -- --hostname 0.0.0.0 --port 3000
```

### 4. Access from Windows using WSL IP
Instead of `http://localhost:3000`, try:
- `http://172.x.x.x:3000` (replace with your WSL IP)
- Or try: `http://[WSL-HOSTNAME].local:3000`

### 5. Enable WSL2 port forwarding
```powershell
# In Windows PowerShell (as Administrator):
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=172.x.x.x
```

### 6. Try binding to all interfaces
```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

### 7. Check Windows firewall
- Windows Defender might be blocking the connection
- Try temporarily disabling Windows Firewall for testing

### 8. Alternative: Use different approach
```bash
# Try these one by one:
npm run dev -- --port 3000 --hostname localhost
npm run dev -- --port 3000 --hostname 0.0.0.0  
npm run dev -- --port 8080 --hostname 0.0.0.0
```

## Test Commands:

### From WSL2:
```bash
# Test if server is running locally in WSL
curl http://localhost:3000
curl http://127.0.0.1:3000
```

### From Windows:
```cmd
# Test from Windows Command Prompt
curl http://localhost:3000
curl http://127.0.0.1:3000
```

## Common WSL2 Solutions:

### Solution 1: Update WSL2
```powershell
# In Windows PowerShell:
wsl --update
wsl --shutdown
wsl
```

### Solution 2: Reset WSL2 networking
```powershell
# In Windows PowerShell (as Administrator):
wsl --shutdown
netsh winsock reset
netsh int ip reset all
netsh winhttp reset proxy
ipconfig /flushdns
```

### Solution 3: Use Windows Terminal with proper setup
Make sure you're using Windows Terminal or proper WSL2 integration.

## Quick Test Steps:

1. **In WSL2 terminal:**
   ```bash
   cd frontend
   rm -rf .next
   npm run dev -- --hostname 0.0.0.0 --port 3000
   ```

2. **Check the output for:**
   - "Local: http://localhost:3000"
   - "Network: http://172.x.x.x:3000"

3. **Try accessing from Windows browser:**
   - http://localhost:3000
   - http://172.x.x.x:3000 (use the Network URL shown)

4. **If nothing works, try:**
   ```bash
   npm run dev -- --port 8080 --hostname 0.0.0.0
   ```
   Then visit: http://localhost:8080

## Last Resort:
If nothing works, you can:
1. Use VS Code with WSL extension and preview in VS Code
2. Use a different port like 8080 or 3001
3. Access the WSL2 IP directly from Windows 