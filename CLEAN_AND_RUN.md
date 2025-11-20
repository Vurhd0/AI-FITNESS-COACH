# Fix Chunk Loading Error

If you're experiencing chunk loading errors, try these steps:

## Method 1: Clean Build Cache (Recommended)

Stop the dev server (Ctrl+C), then run:

**Windows PowerShell:**
```powershell
# Delete .next folder
Remove-Item -Recurse -Force .next

# Delete cache
Remove-Item -Recurse -Force node_modules\.cache

# Restart dev server
npm run dev
```

**Windows CMD:**
```cmd
# Delete .next folder
rmdir /s /q .next

# Delete cache
rmdir /s /q node_modules\.cache

# Restart dev server
npm run dev
```

**Or use the PowerShell script:**
```powershell
.\clean-build.ps1
```

**Mac/Linux:**
```bash
# Delete .next folder
rm -rf .next

# Delete cache
rm -rf node_modules/.cache

# Restart dev server
npm run dev
```

## Method 2: Use the Clean Script

**Windows:**
Double-click `clean-build.bat` or run:
```bash
.\clean-build.bat
```

## Method 3: Full Clean Install

If the above doesn't work:

```bash
# Stop the server (Ctrl+C)
rmdir /s /q .next
rmdir /s /q node_modules
npm install
npm run dev
```

## Common Causes

- Corrupted build cache
- Hot reload issues
- Import/export errors
- TypeScript compilation errors

After cleaning, the app should reload properly!

