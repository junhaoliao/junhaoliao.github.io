---
title: "Using Tools Effectively to Improve Productivity"
date: "2021-01-24"
description: "Recommended tools for ECE297, including VNC viewers, virtual machines, and IDEs for working on EECG UG machines."
tags: ["ece297", "tutorial", "tools", "vnc", "ide"]
---

*You are welcome to repost this anywhere; however, you must state the source and the material must be accessible to the readers without them paying any cost.*

We have received reports of students having laggy connections to the EECG UG machines, while on Piazza we are seeing some of the students struggling with the NetBeans IDE. This post will discuss the recommended tools for the course.

\<Some TA will add a section about VPN soon\>

## Environment

We are only going to discuss the graphical environment here. If you are comfortable coding in command lines via SSH, that's total fine. However, please note that we are supposed to develop a graphical mapper in Milestone 2 and Milestone 3, so a graphical environment is eventually needed.

### 1. VNC

Due to the pandemic situation, all of us will have to access the EECG UG Machines via VNC. Here are two recommendations of VNC Viewers: **Tig<u>er</u>VNC and RealVNC**. Tig<u>ht</u>VNC provides a native client only on Windows with a few bugs, and therefore it is not recommended.

#### a) TigerVNC Viewer

Open-sourced under the GPL v2 license. TigerVNC is branched from TightVNC, and I have found the Viewer to be the most compatible viewer with our school's remote machines, who uses TigerVNC servers.

Official Download Links for TigerVNC Viewer 1.11.0:
Windows: https://bintray.com/tigervnc/stable/download_file?file_path=tigervnc64-1.11.0.exe
macOS: https://bintray.com/tigervnc/stable/download_file?file_path=TigerVNC-1.11.0.dmg

#### b) RealVNC viewer:

Proprietary software but free for our purpose. It is NOT always compatible with our remote machines (e.g. not always able to copy and paste, not auto-resizable). However, since it is proprietary, it usually has less bugs. From my experiments, **RealVNC Viewer is also way less laggy than TigerVNC Viewer under poor network connections.**

Official Download Links for RealVNC:
https://www.realvnc.com/en/connect/download/viewer/

#### c) UG_Remote

Open-sourced Python 3 script under the GPL v3 license. It supports launching with TigerVNC and RealVNC in the latest version (under the Misc tab).

Official Download Links for UG_Remote: http://remote.junhao.ca

### 2. Virtual Machine (VM)

**If you are experiencing a laggy connection to the UG machines, seriously, please consider this option.** You will get very similar experiences if you code with the VM image we provided to you.

VM image available at: http://www.eecg.utoronto.ca/~vaughn/ece297/ECE297VM.ova

Although the VM image is made with VirtualBox, with some conversion you can also get it working with other VM softwares, such as Parallel and VMWare.

#### a) VirtualBox by Oracle

Open-sourced under the GPL v2 license.

Official Download Links for VirtualBox: https://www.virtualbox.org/wiki/Downloads

#### b) (Mac) Parallels Desktop

Proprietary but you can get 50% off here: https://estore.onthehub.com/WebStore/OfferingDetails.aspx?o=40d7a407-38a2-e811-8109-000d3af41938

My experiences with VirtualBox on macOS wasn't great (laggy while it sometimes crashes), so I made the decision to buy Parallels. "I could never imagine such a fluent experience in a VM." It supports the Apple Hypervisor, so the macOS is aware of the VM's existence and tunes up the performance. Moreover, it is well integrated with the macOS and you can access file between the host and virtual machine without any barriers.

It does cost you a few bucks, so you can do a trial before any buying decisions: https://www.parallels.com/ca/products/desktop/trial/

#### c) (Windows) VMWare Workstation Player

Proprietary.

(Don't try VMWare on Mac. Use Parallels instead.)

It is the smoothest VM software I have used on Windows so far. One interesting fact: the newly appointed Intel CEO has served as VMWare's CEO since 2012.

It does cost you a few bucks, so you can do a trial before any buying decisions: https://www.vmware.com/ca/products/workstation-pro/workstation-pro-evaluation.html

## Integrated Development Environment (IDE)

For most people, a good IDE makes them more productive. Nowadays, most IDEs provide advanced features such as intelligent code completion, automatic code formatting, and Git support integration, which are all quite useful in this course. Here are some IDEs you can use on the EECG UG machine:

### 1. NetBeans

Open-sourced under CDDL v1 and LGPL v2.1. We provide NetBeans project configuration files for all Milestone assignments. NetBeans can be launched on any of the UG machine. In the terminal, type:

```
# Don't forget the & , which spawns the command
netbeans&
```

Also, if you wish to launch it directly from the "Applications" menu, type this in the terminal then logout and log back in:

```
# please copy and paste...
bash -c 'echo -e "[Desktop Entry]\nVersion=1.0\nType=Application\nName=NetBeans\nIcon=/cad2/ece297s/netbeans-8.1/nb/netbeans.png\nExec="/cad2/ece297s/netbeans-8.1/bin/netbeans" %f\nCategories=Development;IDE;\nTerminal=false\nStartupNotify=true" > ~/.local/share/applications/netbeans.desktop'
```

### 2. Eclipse

Open-sourced under the Eclipse Public License. We provide Eclipse project configuration files for all Milestone assignments. Eclipse can be launched on any of the UG machine. In the terminal, type:

```
# Don't forget the & , which spawns the command
eclipse&
```

Also, if you wish to launch it directly from the "Applications" menu, type this in the terminal then logout and log back in:

```
# please copy and paste...
bash -c 'echo -e "[Desktop bash -c 'echo -e "[Desktop Entry]\nVersion=1.0\nType=Application\nName=Eclipse IDE\nIcon=/cad1/eclipse/eclipse/icon.xpm\nExec=/nfs/ug/cad/cad1/eclipse/eclipse/eclipse %f\nCategories=Development;IDE;\nTerminal=false\nStartupNotify=true" > ~/.local/share/applications/eclipse.desktop'
```

### 3. CLion

Proprietary software but free for students and open-sourced project developers. To get a free license, use your UofT Email at: https://www.jetbrains.com/shop/eform/students

It has integrated support for Makefiles, Git and **Valgrind**. (Nice!!!)

As you might be aware, we are only given a 2GB quota on the UG machines per account. It is impossible to download and extract CLion directly on a UG machine. Therefore I'm sharing my CLion installation, and you can copy it directly into your home directory:

```
# first make sure you have enough quota
# you will need at least 900M to install and use CLion
quota -s

# this command is untested...
# please let me know whether it works or not
cp -r /nfs/ug/homes-5/l/liaojunh/clion/ ~/
```

To launch it from the terminal:

```
~/clion/bin/clion.sh
```

To setup the toolchains, under the "Customize" tab, click on "All Settings...". Under "Build, Execution, Deployment" -> "Toolchains", click on the "..." button next to CMake and select "/usr/bin/cmake". Now, the "make", "C Compiler", "C++ Compiler" and "Debugger" should be detected automatically. Click "OK" to save the settings.

To launch your Milestone 0 project, under tab "Projects", click on "Open" and select "~/ece297/work/milestone0".

If you wish to launch it directly from the "Applications" menu, in the menu bar of CLion, select "Tools"->"Create Desktop Entry".

### 4. VS Code

Open-sourced by Microsoft under the MIT License.

(To be honest, VS Code doesn't work well with ECE297 on the UG machines due to too many installed libraries. We are still figuring this out.)

Many thanks to Tim, who is the EECG lab manager, we have recently installed VS Code on the UG machines as well. VS Code can be launched on any of the UG machine. In the terminal, type:

```
# Don't forget the & , which spawns the command
code&
```

Also, if you wish to launch it directly from the "Applications" menu, type this in the terminal then logout and log back in:

```
# please copy and paste...
bash -c 'echo -e "[Desktop Entry]\nName=Visual Studio Code\nExec=/nfs/ug/cad/cad1/VSCode/VSCode-linux-x64/bin/code\nIcon=/nfs/ug/cad/cad1/VSCode/VSCode-linux-x64/resources/app/resources/linux/code.png\nTerminal=false\nType=Application\nCategories=Development;IDE;" > ~/.local/share/applications/vscode.desktop'
```
