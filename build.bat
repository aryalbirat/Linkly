@echo off
echo Building the URL Shortener app...

echo Step 1: Installing server dependencies...
npm install

echo Step 2: Installing client dependencies...
cd client
npm install

echo Step 3: Building the React frontend...
npm run build

echo Step 4: Going back to server directory...
cd ..

echo Build complete! You can now run the app with:
echo npm start
pause
