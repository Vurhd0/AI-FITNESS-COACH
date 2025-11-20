@echo off
echo Cleaning Next.js build cache...
if exist .next (
    rmdir /s /q .next
    echo .next folder deleted
)
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo node_modules\.cache deleted
)
echo Build cache cleaned!
echo Starting dev server...
npm run dev

