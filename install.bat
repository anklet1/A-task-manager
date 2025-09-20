@echo off
echo Installing Smart Task Manager dependencies...

echo.
echo Installing root dependencies...
call npm install

echo.
echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo Creating environment files...

if not exist backend\.env (
    echo MONGODB_URI=mongodb://localhost:27017/taskmanager > backend\.env
    echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production >> backend\.env
    echo PORT=5000 >> backend\.env
    echo NODE_ENV=development >> backend\.env
    echo Created backend/.env file
) else (
    echo backend/.env already exists
)

if not exist frontend\.env (
    echo REACT_APP_API_URL=http://localhost:5000 > frontend\.env
    echo Created frontend/.env file
) else (
    echo frontend/.env already exists
)

echo.
echo Installation complete!
echo.
echo To start the application:
echo 1. Make sure MongoDB is running
echo 2. Run: npm run dev
echo 3. Open http://localhost:3000
echo.
pause
