#!/bin/bash

echo "🚀 Starting Metro Yukthi - Pure Frontend Mode!"
echo "✨ Beautiful dark theme with stunning teal & lime colors!"
echo "🔥 No backend, no database, just pure frontend magic!"

cd client
echo "📍 Working in client directory: $(pwd)"
echo "🌟 Launching Vite development server..."

npx vite --host 0.0.0.0 --port 5000

echo "🎯 Metro Yukthi available at http://localhost:5000"
echo "🌙 Switch to dark mode to see those gorgeous colors!"