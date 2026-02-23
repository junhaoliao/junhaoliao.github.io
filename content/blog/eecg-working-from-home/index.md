---
title: "EECG Working from Home"
date: "2020-09-15"
lastModified: "2026-02-23"
description: "A guide to set up JetBrains Projector or VS Code's SSH extension to work on EECG UG lab machines from home."
tags: ["tutorial", "ssh", "vscode", "jetbrains"]
---

This guide will provide instructions to set up either [JetBrains Projector](#jetbrains-projector) or [Visual Studio Code](#vs-code)'s SSH extension to help you do the labs from home more efficiently. By setting up either one of those, you can write code as if you were coding directly on the remote lab machines.

- **Compatible Client OS:** macOS, Windows, and Linux
- **Target:** EECG UG Lab Computers or any other SSH-compatible Unix-like hosts
- **Recommended Setup Time:** 15 minutes for Projector; 10 minutes for VS Code. Actual time varies depending on your network connection or the EECG UG host's load/speed.

You will want to begin by selecting a 2-digit or 3-digit **[lucky](#faq1-how-lucky-am-i) number from 51-100, 130-180, or 201-249**. In the commands below, **replace XXX** with that lucky number, as I recommend configuring all settings below on the same host machine.

## JetBrains Projector

**Prerequisite**: a valid [JetBrains Free Education License](https://www.jetbrains.com/shop/eform/students)

### Install JetBrains `projector-installer` on the EECG Host

1. Connect to the selected EECG UG host using an SSH client. e.g. [iCtrl](https://ictrl.ca/)'s Terminal, PuTTY or OpenSSH.
2. At the time of writing, each student is assigned a 2048MB quota. Before proceeding to installation, you will want to make sure you have enough disk quota by issuing `quota -s` on the EECG host. For example, a complete CLion installation takes about 1200MB of space, and you will want to see the current utilized space below 2048 – 1200 = 848 MB. If you are running out of space, use the `du -ah | sort -h` command or File Cleaner in [iCtrl](https://ictrl.ca/)'s File Manager to identify and delete unused files.
3. Install JetBrains' `projector-installer` script on the EECG host.

```
# install the projector-installer script
pip3 install projector-installer --user
```

4. To easily run `projector-installer` without entering its full path, you will want to include its location in your terminal shell's $PATH variable.

```
nano ~/.cshrc  # or ~/.tcshrc depending on your shell
```

Navigate to the bottom of the file and add the line below. If the file contains a comment directing you to modify $PATH elsewhere, follow those instructions instead.

```
set path = ($path ~/.local/bin)
```

5. Now log out and log back in. Depending on how you connected to the EECG host, this means you might want to close the SSH terminal window, and if you are using a VNC connection, you will have to terminate the VNC session before continuing. e.g. If you are using iCtrl's VNC Viewer, you will want to select "Reset VNC" from the Advanced Menu at the bottom right corner of the window.

### Install IDE

1. Now you should be able to run `projector` in the remote host's terminal without a problem. Note that you will want to override the "cache directory" to use `/tmp` as your user directory will not have enough quota for the installation to be completed. Therefore, the command should be:

```
# if you are seeing "command not found",
#  revisit the last section or post a comment at the bottom of this page
projector --cache-directory=/tmp
```

2. If an agreement shows up, you will want to navigate to the bottom using your mouse's scroll wheel or your keyboard's ↓ key and select yes.
3. Depending on what language you will be working with, select the IDE you need. For example:
   - **APS105, ECE244, ECE297, ECE344**: CLion
   - **APS106, ECE326**: PyCharm Professional
4. Select "No" when you are asked whether you want to use Projector-tested IDE only, so that you will be able to see the latest IDE version in the coming list.
5. Select the version you want to install. If you have no preference, I recommend always using the latest version.

The installation should now run and a Projector server instance will be launched if the installation is successful. Now you can do an SSH port-forward between your machine and the remote target and access the IDE in a browser on your machine. If you don't know what this is all about or simply don't want the hassle of setting up forward channels, you can [Run the IDE without Projector](#run-the-ide-without-projector).

### Run the IDE without Projector

The following steps will help you to locate the IDE installation and create a Desktop Entry shortcut so you will be able to launch the IDE with a single click in the future.

1. In a graphical environment (VNC or physical machine) of any EECG UG machine, open a terminal and run the following depending on your IDE of choice:

```
# The following path might be different if you selected a different version to install

# CLion
~/.projector/apps/clion-2022.2.1/bin/clion.sh

# PyCharm
~/.projector/apps/pycharm-2022.2.1/bin/pycharm.sh
```

2. Accept the agreement and activate your JetBrains license if you are prompted to do so.
3. In the "Welcome to CLion" window, click the "gear" button in the bottom left and select "Create Desktop Entry". Click "OK" to proceed.
4. Now you should be able to find CLion in the "Application -> Programming" Menu of the taskbar. If not, log out and log back in and you should be able to see it. You can right click on it to create a shortcut on the taskbar or on the desktop.

![CLion Desktop Entry](/images/blog/eecg-working-from-home/clion-desktop-entry.webp)

## VS Code

### (Optional) SSH Auto-Login

This section only explains how to set up automatic SSH login on **Mac and Linux**. If you are lucky enough to have recent versions of **Windows** installed, the instructions will work for you as well.

Now you might get disturbed by password prompts, but you can create a security key on your computer, so the remote machine recognizes you every time you log in. However, please note that **you should only do the following on your own computer**!!

**Please do not proceed if you do not understand the risk!**

1. Open your computer's **Terminal** App

2. Create a security key on your computer

```
# keep hitting "return" on your keyboard to use default settings
ssh-keygen -t rsa
```

3. By hitting "return" on your keyboard a few more times, make sure you have completed the security key generation with default settings.

4. Copy and modify the necessary fields ("username" and "machine host number XXX") in the command below, then paste it into the terminal again

```
cat ~/.ssh/id_rsa.pub | ssh userName@ug251.eecg.toronto.edu "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys"
# enter your password when prompted
```

5. Now you should be able to automatically log in via SSH, without having to enter your password every time.

### Install Visual Studio Code

Download Visual Studio Code (Insider version is not recommended as bugs are commonly present in those versions):
[https://code.visualstudio.com](https://code.visualstudio.com/)

### Install extension "Remote - SSH"

1. Launch VSCode and click on the Extensions tab in the leftmost toolbar. Search for "**SSH**", and install extension "Remote-SSH".

![Install extension "Remote-SSH"](/images/blog/eecg-working-from-home/remote-ssh-extension.webp)

2. (You don't need to do this step on Windows) To mitigate some bug in the latest version of the "Remote-SSH" extension, we need to disable feature "Use Local Server". Open settings and search for "**remote.ssh.uselocalserver**". Then **disable** it.

![Disable "Use Local Server" in Remote-SSH](/images/blog/eecg-working-from-home/disable-local-server.webp)

### Add New SSH Host

1. Launch **Command Palette** by either clicking the gear button at the bottom left, or using keyboard shortcut "Shift+Command+P". Search for "**SSH**" and select "**Remote-SSH: Add New SSH Host...**"

![Select "Remote-SSH: Add New SSH Host..." from Command Palette](/images/blog/eecg-working-from-home/command-palette-ssh.webp)

2. Copy the below command and modify the necessary fields, then paste it into the "**Enter SSH Connection Command**" Prompt.

```
ssh ugUserName@ugXXX.eecg.toronto.edu
```

![Enter SSH Connection Command](/images/blog/eecg-working-from-home/ssh-connection-command.webp)

3. The next prompt asks where you want to store this SSH host. I recommend storing it in your user directory, which is the first option.

![Select where to store your SSH host](/images/blog/eecg-working-from-home/store-ssh-host.webp)

### Connect to Remote Host and Start Working

1. Search for "**SSH**" again in the **Command Palette**. This time we click on "**Remote-SSH: Connect to Host...**".
2. Select the host we just added and a new window should pop up.
3. Enter your EECG UG remote password if prompted and wait for the installation to finish. The installation usually takes less than 1 minute.
4. Click on the **Explorer** tab in the toolbar and click on "**Open folder**". Select your repository and you can start working!

![Open folder in VS Code](/images/blog/eecg-working-from-home/open-folder.webp)

## Frequently Asked Questions

### FAQ1: How lucky am I?

You can run the `uptime` command to see how many users are using the current computer. The user count is incremented when someone logs in with an SSH shell or opens a terminal shell on the physical computer. Since some people might not use SSH Shells to log in remotely, the number might not always be incremented even if someone is using the machine. Then you will want to check the 1-minute, 5-minute, 15-minute average load of the machine and make your own decisions.

```
# Output format:
#  - The current time
#  - How long the system has been running
#  - How many users are currently logged on
#  - The system load averages for the past 1, 5, and 15 minutes.
uptime
```
