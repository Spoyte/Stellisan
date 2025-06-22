# Stellisan Frontend Troubleshooting Guide

## Issue: "Unable to connect" on both port 3000 and 3001

### Step 1: Check what's running on ports
```bash
# Check what's using port 3000
lsof -i :3000

# Check what's using port 3001  
lsof -i :3001

# Check all Node.js processes
ps aux | grep node
```

### Step 2: Kill all Node.js processes
```bash
# Kill all node processes (be careful!)
pkill -f node

# Or more specifically for Next.js
pkill -f "next dev"
```

### Step 3: Clear everything and restart
```bash
# From the frontend directory:
rm -rf .next
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### Step 4: Try a different port explicitly
```bash
npm run dev -- --port 3002
```

### Step 5: Check for compilation errors
Look at the terminal output when running `npm run dev`. Common issues:

**A. TypeScript Errors:**
- Look for red error messages about types
- Our components might have import issues

**B. Dependency Issues:**
- Missing packages
- Version conflicts
- Native module compilation issues

### Step 6: Test with minimal setup
If the above doesn't work, try this minimal test:

```bash
# Create a new test directory
mkdir ../test-next
cd ../test-next

# Initialize minimal Next.js
npm init -y
npm install next@latest react@latest react-dom@latest
mkdir pages
echo 'export default function Home() { return <h1>Test Works!</h1> }' > pages/index.js

# Add script to package.json
npm pkg set scripts.dev="next dev"

# Run
npm run dev
```

### Step 7: Check browser console
If the server starts but pages don't load:
1. Open browser dev tools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests

### Step 8: Check network/firewall
```bash
# Test if localhost works
curl http://localhost:3000

# Test if the specific IP works
curl http://127.0.0.1:3000

# Check if port is actually open
netstat -tulpn | grep 3000
```

### Step 9: WSL-specific issues (if using WSL)
```bash
# Check WSL network
cat /etc/resolv.conf

# Try accessing from Windows
# In Windows browser: http://localhost:3000
# Or: http://[WSL-IP]:3000
```

### Step 10: Environment issues
```bash
# Check Node.js version
node --version

# Check npm version  
npm --version

# Check if there are any global Next.js installations
npm list -g next
```

## Quick Tests to Run:

1. **Basic server test:**
   ```bash
   cd frontend
   npm run dev -- --port 3002
   ```

2. **Visit these URLs in order:**
   - http://localhost:3002/minimal
   - http://localhost:3002/working  
   - http://localhost:3002/test
   - http://localhost:3002/

3. **Check terminal output for specific errors**

## Common Error Messages and Solutions:

### "EADDRINUSE: address already in use"
```bash
lsof -ti:3000 | xargs kill -9
```

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Cannot resolve module" for our custom paths
- Check tsconfig.json paths configuration
- Ensure all imported files exist

### TypeScript compilation errors
- Check for missing types
- Look for syntax errors in .tsx files

## If Nothing Works:
1. Share the exact error message from terminal
2. Share browser console errors  
3. Try the minimal Next.js test above
4. Check if other Node.js apps work on your system 