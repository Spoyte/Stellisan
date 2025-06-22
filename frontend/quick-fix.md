# Quick Fix for "Unable to Connect" Issue

## Try these commands in order:

### 1. Kill all processes and clear cache:
```bash
cd frontend
pkill -f "next dev"
rm -rf .next
```

### 2. Try a fresh start on port 3002:
```bash
npm run dev -- --port 3002
```

### 3. If that doesn't work, check what the terminal says:
Look for error messages like:
- "Module not found"
- "Cannot resolve"
- TypeScript errors
- Compilation failed

### 4. Test basic connectivity:
```bash
# In another terminal:
curl http://localhost:3002
```

### 5. Check browser console:
- Open browser dev tools (F12)
- Look for JavaScript errors in Console tab
- Check Network tab for failed requests

## Most likely causes:

1. **Compilation errors** - Check terminal output for red error messages
2. **Port conflicts** - Try different ports (3002, 3003, etc.)
3. **WSL networking** - If using WSL, try accessing from Windows host
4. **Dependency issues** - Our complex imports might be failing

## Quick test:
Visit: http://localhost:[PORT]/minimal

This page has zero dependencies and should work if Next.js is running.

## Share with me:
1. Exact terminal output when running npm run dev
2. Any error messages in browser console
3. What happens when you visit /minimal page 