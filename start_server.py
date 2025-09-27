"""
Smart Crop Advisory System - Development Server Startup Script
==============================================================

This script helps start the Flask development server with proper configuration.
It also runs basic checks to ensure everything is working correctly.

Usage: python start_server.py
"""

import os
import sys
import subprocess
import time
import requests
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    print("🔍 Checking Python version...")
    
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required!")
        print(f"   Current version: {sys.version}")
        return False
    
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    print("\n🔍 Checking dependencies...")
    
    required_packages = [
        'flask', 'flask_cors', 'sklearn', 'pandas', 
        'numpy', 'joblib'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package}")
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {missing_packages}")
        print("📦 Installing missing packages...")
        
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
            ])
            print("✅ Dependencies installed successfully!")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies!")
            print("   Please run: pip install -r requirements.txt")
            return False
    
    return True

def create_directories():
    """Create necessary directories"""
    print("\n🔍 Creating directories...")
    
    directories = ['model', 'logs']
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ {directory}/ directory ready")

def start_flask_server():
    """Start the Flask development server"""
    print("\n🚀 Starting Flask development server...")
    print("   Server will be available at: http://localhost:5000")
    print("   Press Ctrl+C to stop the server")
    print("\n" + "="*60)
    
    # Set environment variables
    os.environ['FLASK_APP'] = 'app.py'
    os.environ['FLASK_ENV'] = 'development'
    os.environ['FLASK_DEBUG'] = '1'
    
    try:
        # Start the Flask app
        from app import app
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=True,
            use_reloader=True
        )
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {str(e)}")
        return False
    
    return True

def run_quick_test():
    """Run a quick test to verify the server is working"""
    print("\n🔍 Running quick server test...")
    
    # Wait for server to start
    time.sleep(3)
    
    try:
        response = requests.get('http://localhost:5000/health', timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Server is running correctly!")
            print(f"   Status: {data.get('status')}")
            print(f"   Model loaded: {data.get('model_loaded')}")
            return True
        else:
            print(f"⚠️  Server responded with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"⚠️  Could not connect to server: {str(e)}")
        print("   This is normal if the server is still starting up")
        return False

def print_api_info():
    """Print API endpoint information"""
    print("\n📋 API Endpoints:")
    print("="*60)
    print("🏥 Health Check:")
    print("   GET  http://localhost:5000/health")
    print("\n🔮 Crop Prediction:")
    print("   POST http://localhost:5000/predict")
    print("   Content-Type: application/json")
    print("\n📊 Model Information:")
    print("   GET  http://localhost:5000/model-info")
    
    print("\n📝 Example Prediction Request:")
    print("""
    curl -X POST http://localhost:5000/predict \\
      -H "Content-Type: application/json" \\
      -d '{
        "N": 90,
        "P": 42,
        "K": 43,
        "temperature": 20.87,
        "humidity": 82.00,
        "ph": 6.50,
        "rainfall": 202.93,
        "soil_type": "Loamy",
        "season": "Kharif"
      }'
    """)
    
    print("\n🧪 To run API tests:")
    print("   python test_api.py")

def main():
    """Main startup function"""
    print("🌾 Smart Crop Advisory System - Backend Server")
    print("="*60)
    
    # Run pre-flight checks
    if not check_python_version():
        sys.exit(1)
    
    if not check_dependencies():
        sys.exit(1)
    
    create_directories()
    
    # Print API information
    print_api_info()
    
    # Start the server
    print("\n" + "="*60)
    input("Press Enter to start the server (or Ctrl+C to cancel)...")
    
    start_flask_server()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Startup cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Startup error: {str(e)}")
        sys.exit(1)
