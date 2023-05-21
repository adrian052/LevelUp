import os
import subprocess
backend_process = subprocess.Popen(["node", "backend/server.js"])
print("Servidor backend iniciado.")
os.chdir("frontend")
os.system("npm start")
backend_process.terminate()
