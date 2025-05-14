@echo off
echo Starting the URL Shortener application in development mode...

echo Step 1: Starting the backend server (node.js/express)...
start cmd /k "npm run dev"

echo Step 2: Waiting for the backend to initialize...
timeout /t 3

echo Step 3: Starting the frontend development server (React)...
cd client
start cmd /k "npm start"

echo Development servers started!
echo Backend running on http://localhost:8000
echo Frontend running on http://localhost:3000
