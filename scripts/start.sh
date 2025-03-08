#!/bin/bash
# Script to start GhostFund backend and frontend

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required dependencies
echo "Checking dependencies..."
if ! command_exists node; then
  echo "Node.js is not installed. Please install Node.js v16 or higher."
  exit 1
fi

if ! command_exists npm; then
  echo "npm is not installed. Please install npm."
  exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
  echo "Node.js version is too old. Please install Node.js v16 or higher."
  exit 1
fi

# Install dependencies if needed
echo "Installing dependencies..."
cd backend && npm install
cd ../frontend && npm install
cd ..

# Build frontend
echo "Building frontend..."
cd frontend && npm run build
cd ..

# Start backend and frontend in development mode
if [ "$1" = "dev" ]; then
  echo "Starting in development mode..."
  
  # Start backend in background
  cd backend && npm run dev &
  BACKEND_PID=$!
  
  # Start frontend
  cd ../frontend && npm run dev &
  FRONTEND_PID=$!
  
  # Handle graceful shutdown
  trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
  
  # Wait for processes
  wait
else
  # Start in production mode
  echo "Starting in production mode..."
  
  # Start backend in background
  cd backend && npm start &
  BACKEND_PID=$!
  
  # Start frontend
  cd ../frontend && npm start &
  FRONTEND_PID=$!
  
  # Handle graceful shutdown
  trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
  
  # Wait for processes
  wait
fi 