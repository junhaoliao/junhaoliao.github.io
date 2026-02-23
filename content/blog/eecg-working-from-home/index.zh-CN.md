---
title: "EECG 居家办公指南"
date: "2020-09-15"
lastModified: "2026-02-23"
description: "配置 JetBrains Projector 或 VS Code 的 SSH 扩展，在家远程使用 EECG UG 实验室机器的指南。"
tags: ["tutorial", "ssh", "vscode", "jetbrains"]
---

本指南将介绍如何配置 [JetBrains Projector](#jetbrains-projector) 或 [Visual Studio Code](#vs-code) 的 SSH 扩展，帮助你更高效地在家完成实验。配置完成后，你可以像直接在远程实验室机器上编程一样编写代码。

- **兼容的客户端操作系统：** macOS、Windows 和 Linux
- **目标：** EECG UG 实验室电脑或其他兼容 SSH 的类 Unix 主机
- **预计配置时间：** Projector 约 15 分钟；VS Code 约 10 分钟。实际时间取决于你的网络连接速度或 EECG UG 主机的负载。

首先，你需要选择一个 2 位或 3 位的**[幸运](#faq1我有多幸运)数字（范围：51-100、130-180 或 201-249）**。在下面的命令中，**将 XXX 替换**为你选择的幸运数字，建议将所有设置都配置在同一台主机上。

## JetBrains Projector

**前提条件**：一个有效的 [JetBrains 免费教育许可证](https://www.jetbrains.com/shop/eform/students)

### 在 EECG 主机上安装 JetBrains `projector-installer`

1. 使用 SSH 客户端连接到所选的 EECG UG 主机。例如 [iCtrl](https://ictrl.ca/) 的终端、PuTTY 或 OpenSSH。
2. 在撰写本文时，每位学生被分配了 2048MB 的磁盘配额。在继续安装之前，你需要通过在 EECG 主机上运行 `quota -s` 来确认有足够的磁盘配额。例如，完整安装 CLion 大约需要 1200MB 的空间，你需要确保当前已使用的空间低于 2048 – 1200 = 848 MB。如果空间不足，可以使用 `du -ah | sort -h` 命令或 [iCtrl](https://ictrl.ca/) 文件管理器中的文件清理功能来查找并删除不需要的文件。
3. 在 EECG 主机上安装 JetBrains 的 `projector-installer` 脚本。

```
# 安装 projector-installer 脚本
pip3 install projector-installer --user
```

4. 为了方便运行 `projector-installer` 而无需输入完整路径，你需要将其所在位置添加到终端 shell 的 $PATH 变量中。

```
nano ~/.cshrc  # 或 ~/.tcshrc，取决于你的 shell
```

滚动到文件底部并添加以下行。如果文件中有注释指示你在其他地方修改 $PATH，请按照那些指示操作。

```
set path = ($path ~/.local/bin)
```

5. 现在注销并重新登录。这意味着你可能需要关闭 SSH 终端窗口；如果使用的是 VNC 连接，则需要在继续之前终止 VNC 会话。例如，如果你使用的是 iCtrl 的 VNC 查看器，你需要从窗口右下角的高级菜单中选择"Reset VNC"。

### 安装 IDE

1. 现在你应该能够在远程主机的终端中正常运行 `projector`。注意，你需要将"缓存目录"覆盖为 `/tmp`，因为你的用户目录没有足够的配额来完成安装。因此，命令应该是：

```
# 如果看到 "command not found"，
#  请回顾上一节或在本页底部留言
projector --cache-directory=/tmp
```

2. 如果出现许可协议，使用鼠标滚轮或键盘的 ↓ 键滚动到底部，然后选择 yes。
3. 根据你要使用的编程语言，选择所需的 IDE。例如：
   - **APS105、ECE244、ECE297、ECE344**：CLion
   - **APS106、ECE326**：PyCharm Professional
4. 当系统询问是否只使用经过 Projector 测试的 IDE 时，选择"No"，这样你就能在列表中看到最新的 IDE 版本。
5. 选择你要安装的版本。如果没有特别偏好，我建议始终使用最新版本。

安装完成后，如果安装成功，将启动一个 Projector 服务器实例。现在你可以在你的机器和远程目标之间建立 SSH 端口转发，然后在浏览器中访问 IDE。如果你不了解这是什么，或者不想费心设置转发通道，可以参考[不通过 Projector 运行 IDE](#不通过-projector-运行-ide)。

### 不通过 Projector 运行 IDE

以下步骤将帮助你找到 IDE 的安装位置，并创建桌面快捷方式，以便将来可以一键启动 IDE。

1. 在任意 EECG UG 机器的图形环境（VNC 或物理机器）中，打开终端并根据你选择的 IDE 运行以下命令：

```
# 如果你安装了不同的版本，以下路径可能会有所不同

# CLion
~/.projector/apps/clion-2022.2.1/bin/clion.sh

# PyCharm
~/.projector/apps/pycharm-2022.2.1/bin/pycharm.sh
```

2. 如果出现许可协议，请接受并激活你的 JetBrains 许可证。
3. 在"Welcome to CLion"窗口中，点击左下角的"齿轮"按钮，选择"Create Desktop Entry"。点击"OK"继续。
4. 现在你应该能在任务栏的"Application -> Programming"菜单中找到 CLion。如果找不到，注销后重新登录即可看到。你可以右键点击它，在任务栏或桌面上创建快捷方式。

![CLion 桌面快捷方式](/images/blog/eecg-working-from-home/clion-desktop-entry.webp)

## VS Code

### （可选）SSH 免密登录

本节仅介绍如何在 **Mac 和 Linux** 上设置 SSH 免密登录。如果你使用的是较新版本的 **Windows**，这些指令同样适用。

你可能会觉得每次输入密码很烦，但你可以在自己的电脑上创建一个安全密钥，这样远程机器每次登录时都会自动识别你。不过请注意，**你只应该在自己的电脑上执行以下操作**！！

**如果你不了解其中的风险，请不要继续！**

1. 打开你电脑上的**终端**应用

2. 在你的电脑上创建安全密钥

```
# 一直按"return"键使用默认设置
ssh-keygen -t rsa
```

3. 再按几次"return"键，确保使用默认设置完成安全密钥的生成。

4. 复制并修改下面命令中的必要字段（"用户名"和"机器主机编号 XXX"），然后粘贴到终端中

```
cat ~/.ssh/id_rsa.pub | ssh userName@ug251.eecg.toronto.edu "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys"
# 提示时输入你的密码
```

5. 现在你应该可以通过 SSH 自动登录，无需每次都输入密码了。

### 安装 Visual Studio Code

下载 Visual Studio Code（不推荐 Insider 版本，因为这些版本通常存在较多 bug）：
[https://code.visualstudio.com](https://code.visualstudio.com/)

### 安装扩展 "Remote - SSH"

1. 启动 VSCode，点击最左侧工具栏中的扩展选项卡。搜索"**SSH**"，然后安装扩展"Remote-SSH"。

![安装扩展 "Remote-SSH"](/images/blog/eecg-working-from-home/remote-ssh-extension.webp)

2. （Windows 用户可以跳过此步骤）为了解决"Remote-SSH"扩展最新版本中的一个 bug，我们需要禁用"Use Local Server"功能。打开设置并搜索"**remote.ssh.uselocalserver**"，然后**禁用**它。

![禁用 Remote-SSH 中的 "Use Local Server"](/images/blog/eecg-working-from-home/disable-local-server.webp)

### 添加新的 SSH 主机

1. 通过点击左下角的齿轮按钮或使用键盘快捷键"Shift+Command+P"打开**命令面板**。搜索"**SSH**"并选择"**Remote-SSH: Add New SSH Host...**"

![从命令面板中选择 "Remote-SSH: Add New SSH Host..."](/images/blog/eecg-working-from-home/command-palette-ssh.webp)

2. 复制下面的命令并修改必要的字段，然后粘贴到"**Enter SSH Connection Command**"提示框中。

```
ssh ugUserName@ugXXX.eecg.toronto.edu
```

![输入 SSH 连接命令](/images/blog/eecg-working-from-home/ssh-connection-command.webp)

3. 下一个提示会询问你要在哪里存储此 SSH 主机。我建议存储在你的用户目录中，即第一个选项。

![选择 SSH 主机存储位置](/images/blog/eecg-working-from-home/store-ssh-host.webp)

### 连接到远程主机并开始工作

1. 在**命令面板**中再次搜索"**SSH**"。这次点击"**Remote-SSH: Connect to Host...**"。
2. 选择我们刚添加的主机，一个新窗口应该会弹出。
3. 如果提示输入密码，输入你的 EECG UG 远程密码并等待安装完成。安装通常不到 1 分钟。
4. 点击工具栏中的**资源管理器**选项卡，然后点击"**Open folder**"。选择你的仓库就可以开始工作了！

![在 VS Code 中打开文件夹](/images/blog/eecg-working-from-home/open-folder.webp)

## 常见问题

### FAQ1：我有多幸运？

你可以运行 `uptime` 命令来查看当前有多少用户正在使用这台电脑。用户计数在有人通过 SSH shell 登录或在物理机器上打开终端时会增加。由于有些人可能不使用 SSH Shell 远程登录，即使有人在使用机器，计数也不一定会增加。你可以查看机器的 1 分钟、5 分钟和 15 分钟平均负载，然后自行判断。

```
# 输出格式：
#  - 当前时间
#  - 系统已运行时间
#  - 当前登录的用户数
#  - 过去 1、5 和 15 分钟的系统平均负载
uptime
```
