import os
os.chdir("frontend")
os.system("npm install")
os.chdir("../backend")
os.system("npm install")
print("Setup completed.")