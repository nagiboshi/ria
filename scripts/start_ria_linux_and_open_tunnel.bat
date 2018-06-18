Taskkill /IM putty.exe /F
cd C:
cd "Program Files"
cd PuTTY
start putty.exe -ssh alexdev@172.26.61.182 -pw metal1up -L 9229:localhost:9229 -L 3000:localhost:3000 -m ./update_version_on_linux_commands.txt
