#!/bin/bash
set -e

echo "===================================================="
echo "            STREAMHOME AUTOMATED SETUP WIZARD"
echo "===================================================="
echo ""

# Helper function to install using apt
install_apt() {
    echo "Using APT package manager to install dependencies..."
    sudo apt-get update
    sudo apt-get install -y python3 python3-pip nodejs npm ffmpeg rclone
}

# Helper function to install using yum
install_yum() {
    echo "Using YUM package manager to install dependencies..."
    sudo yum check-update || true
    sudo yum install -y epel-release
    sudo yum install -y python3 python3-pip nodejs npm ffmpeg rclone
}

# Helper function to install using homebrew
install_brew() {
    echo "Using Homebrew to install dependencies..."
    brew update
    brew install python node ffmpeg rclone
}

# 1. Determine platform and install package system dependencies
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if [ -x "$(command -v apt-get)" ]; then
        install_apt
    elif [ -x "$(command -v yum)" ]; then
        install_yum
    else
        echo "Error: Supported package manager (apt/yum) not found. Please install python3, pip, node, npm, ffmpeg, and rclone manually."
        exit 1
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    if [ -x "$(command -v brew)" ]; then
        install_brew
    else
        echo "Homebrew is missing. Installing Homebrew first..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        eval "$(/opt/homebrew/bin/brew shellenv)"
        install_brew
    fi
else
    echo "Unsupported OS type. Please install python3, pip, node, npm, ffmpeg, and rclone manually."
    exit 1
fi

# 2. Install requirements
echo ""
echo "Installing Server Python dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r server/requirements.txt

echo ""
echo "Installing Web Client Node dependencies..."
cd web
npm install
cd ..

# 3. Grant execute permissions to start/stop scripts
chmod +x start.sh start_background.sh stop.sh setup.sh || true

echo ""
echo "===================================================="
echo "       DEPENDENCIES ARE SUCCESSFULLY INSTALLED"
echo "           LAUNCHING SETUP CONFIGURATION..."
echo "===================================================="
echo ""
python3 server/cli.py --setup
