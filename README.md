# WinPE-VNC

This project creates a Virtual Network Computing (VNC) server within a Windows Preinstallation Environment (WinPE) using NoVNC, Websockify (built from Node.js), and a Python-based HTTP server. It also includes a self-hosted VNC client accessible from anywhere within the local network. It started as a simple project to be able to VNC into systems within my work environment following a guide from [sjkingo/winpe_vnc](https://github.com/sjkingo/winpe_vnc), but I noticed there were some changes over the decade since the guide was written.

## Blog Post: **[Empowering WinPE with a Browser-Based VNC](https://johnle.org/blog/post/2024/09/04/WinPE-VNC.html)**
## Table of Contents

1. [Disclaimer](#disclaimer)
2. [Features](#features)
3. [Requirements](#requirements)
4. [Setup Instructions](#setup-instructions)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [Acknowledgements](#acknowledgements)
8. [FAQ](#faq)
9. [Contact](#connect-with-me)

## Disclaimer
No liability is held by me in the event of: The VNC server is accessed due to it being port-forwarded and your local IT/system administrator getting very upset<strike>, the WinPE environment gaining sentience and taking over the world.</strike>

## Features

- A VNC server in the WinPE environment
- A browser-based VNC client accessible from most modern browsers
- Accessibilty to the VNC server from within the local network (port forwarding may allow for external access)

## Requirements

- A Windows 10/11 based system
- Node.JS
- Python 3.12 (may be varied, but tested on Python 3.12).
- TightVNC

## Setup Instructions
Video Tutorial coming soon...

1. Follow [Microsoft's guide on building WinPE](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/download-winpe--windows-pe?view=windows-11). *// This guide assumes that C:\WinPE\ is where the WinPE build files are stored.*
2. Once the environment is setup, mount the WinPE's boot.wim using the following command from Command Prompt as an Administrator: *// This allows you to modify the WinPE filesystem.*
`DISM /Mount-Image /ImageFile:C:\WinPE\media\sources\boot.wim /MountDir:C:\WinPE\mount /Index:1`
3. Install [TightVNC](https://www.tightvnc.com/download.php) and configure it as a system service. Set a password and change ports if desired (Default = 5900).
4. Execute the following commands to export the registry keys and files associated with TightVNC.
```batch
mkdir C:\VNC
reg export "HKEY_LOCAL_MACHINE\SOFTWARE\TightVNC" C:\VNC\vnc.reg
copy C:\Program Files\TightVNC\*.* C:\VNC\
```
6. Download either this repository or the pre-built executables and server.zip found in the releases section and move/extract them to C:\VNC\. Ensure there is a separate folder at C:\VNC\server. If downloading the pre-built executables, skip to step 10.
7. Ensure [Node.JS](https://nodejs.org) and [Python](https://python.org) are installed and execute the following commands: *// PyInstaller and PKG are used to build the standalone executables found in the releases section, since NodeJS and Python are too bulky to install into WinPE.*
```batch
pip install PyInstaller
npm install --save @maximegris/node-websockify
npm install pkg
```
8. Modify the Python and NodeJS scripts as desired.
9. From a Command Prompt running as Administrator, execute the following commands to create standalone executables for WinPE:
```batch
python -m PyInstaller --onefile C:\VNC\server\winpe_httpserver.py
pkg -t node*-win-x64 C:\VNC\winpe_vnc.js
```
- *By default, the winpe_httpserver serves the http server via port 8000, but a port can be specified using `\path\to\winpe_httpserver.exe [PORT NUMBER]`. For instance, `C:\VNC\winpe_httpserver.exe 80` will remove the need of specifying the port in the URL when accessing the VNC client. (Final URL would be something like `http://192.168.0.100/#host=192.168.0.100&port=192.168.0.100`*
- 
10. Copy C:\VNC to C:\WinPE\mount\Windows. *// You can delete the original winpe_httpserver.py and winpe_vnc.js if so desired.*
11. Download [NirCMD](https://www.nirsoft.net/utils/nircmd.html) and place nircmd.exe in C:\WinPE\mount\Windows\System32. *// This extends the functionality of Windows commands and will be used for the standalone executables.*
12. Navigate to C:\WinPE\mount\Windows\System32 and open startnet.cmd with Notepad then add and save the following lines: *// The nircmd.exe exec hide command essentially runs the standalone executables as a background task to reduce distractions and prevent a Command Prompt from being locked up with either winpe_vnc or winpe_httpserver.*
```batch
@echo off
wpeinit >nul 2>&1
wpeutil InitializeNetwork
wpeutil DisableFirewall
powercfg /s 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
cd X:\
regedit /s X:\Windows\VNC\vnc.reg
X:\Windows\VNC\tvnserver.exe -install -silent
X:\Windows\VNC\tvnserver.exe -start
X:\Windows\System32\nircmd.exe exec hide "X:\Windows\VNC\winpe_vnc.exe"
cd X:\Windows\VNC\server
X:\Windows\System32\nircmd.exe exec hide "winpe_httpserver.exe"
cd X:\
ipconfig
```
12. Close all folders/files from C:\WinPE\mount and execute the following command from a Command Prompt as an Administrator to dismount and commit the changes.
`DISM /Unmount-WIM /MountDir:C:\WinPE\mount /Commit`
13. Once committed, the WinPE installation is ready to be installed onto a USB or HDD of your choice. // *[Creating a WinPE ISO](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/winpe-create-usb-bootable-drive?view=windows-11#create-a-winpe-iso-dvd-or-cd) file and using [Rufus](https://rufus.ie) is typically the most straight forward approach.*

## Usage
Once booting into WinPE, the startnet.cmd file will autorun and setup the VNC environment. Locate the IPv4 address found after running the ipconfig command.
Access the VNC client via any web browser from a computer on the same network using:

http://[IP ADDRESS]:[PORT (DEFAULT=8000)/#host=[IP ADDRESS]&port=[PORT (DEFAULT=8113)]

A real example would be:

http://192.168.0.100:8000/#host=192.168.0.100&port=8113

And press Connect under the WinPEVNC logo.

## FAQ

Q: What is WinPE?
A: Windows Preinstallation Environment (WinPE) is a minimal Windows operating system environment designed for troubleshooting and recovery purposes.

Q: Can this be used in a production environment?
A: While this project is functional, it's primarily designed for testing and development purposes. Use caution when deploying in production environments.

Q: Are there any security concerns?
A: As with any VNC setup, ensure proper firewall configurations and use strong passwords. Consider using SSH tunneling for enhanced security.

Q: How do I troubleshoot connectivity issues?
A: Ensure the WinPE machine is connect

## Contributing

Contributions are welcome! Please feel free to submit pull requests or issues.

## Acknowledgements
- noVNC: https://github.com/novnc/novnc
- GitHub user sjkingo: https://github.com/sjkingo

## Connect With Me
- [Email: John@JohnLe.org](mailto:John@JohnLe.org)
- [Website: JohnLe.org](https://johnle.org)
- [Blog: JohnLe.org/blog](https://johnle.org/blog)
- [LinkedIn: /in/JohnLe](https://linkedin.com/JohnLe)
