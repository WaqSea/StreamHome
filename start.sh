#!/bin/bash
echo "===================================================="
echo "Starting StreamHome in Background (Detached Mode)"
echo "===================================================="
echo ""

# 1. Stop any currently running instances first to prevent port conflicts (EADDRINUSE)
if [ -f "./stop.sh" ]; then
    bash ./stop.sh
    echo ""
fi

echo "Launching FastAPI Server in background..."
if [ -d "venv" ]; then
    # Use 'python' instead of 'python3' inside venv to guarantee virtualenv context is used
    nohup bash -c "source venv/bin/activate && cd server && python main.py" > backend.log 2>&1 &
else
    # Fallback to python3 if no venv folder exists
    nohup bash -c "cd server && python3 main.py" > backend.log 2>&1 &
fi

echo "Launching Vite Dev Server in background..."
nohup bash -c "cd web && npm run dev" > frontend.log 2>&1 &

echo ""
echo "Both servers launched in the background."
echo "Logs are written to backend.log and frontend.log."
echo "To stop them, run ./stop.sh or kill python3/node processes."
echo "===================================================="
