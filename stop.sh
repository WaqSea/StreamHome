#!/bin/bash
echo "===================================================="
echo "Stopping StreamHome backend and frontend processes..."
echo "===================================================="
pkill -f "python3 main.py"
pkill -f "npm run dev"
pkill -f "node"
echo "Processes terminated."
