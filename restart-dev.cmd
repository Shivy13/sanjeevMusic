@echo off
taskkill /F /IM node.exe 2>nul
timeout /t 3 >nul
cd /d C:\Users\SHIVANI\Downloads\devotional-event-booking-website
npm run dev
