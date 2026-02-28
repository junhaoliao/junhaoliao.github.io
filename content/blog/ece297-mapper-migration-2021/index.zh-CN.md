---
title: "ECE297 Mapper 迁移指南（2021）"
date: "2021-05-01"
lastModified: "2026-02-24"
description: "2021年更新版指南：将 ECE297 Mapper 项目从多大 EECG 实验室机器迁移到本地 Linux 系统。"
tags: ["tutorial", "ece297", "linux"]
---

![Mapper 截图 - 多伦多](/images/blog/ece297-mapper-migration-2021/mapper-toronto.webp)

**声明：我们并不拥有部分课程文件的著作权，譬如 osmXml2bin 及 EZGL 库。请不要将课程文件发布在公共库里。**

## 阅读之前 ...

取决于你的网络连接，以下操作可能需要 10-15 分钟。强烈建议在操作前完整阅读本指南，以便选择更合适的方式。这也有助于你排查步骤中遇到的问题。欢迎在下方留言或在我的主页留言，我看到就会尽快回复。

## 背景

由于课程文件将在暑假期间更新，我们很多人可能希望将自己的工作备份到自己的机器上。按照以下步骤，我们可以让 mapper 在本地 Linux 系统上重新运行，无论是直接安装在电脑上还是在虚拟机（VM）中。

## 环境要求

- 已安装 Linux 操作系统。你可以直接在电脑上安装，也可以使用课程提供的虚拟机。

**[方案 A，推荐] 直接在你的电脑上安装 Linux。**
为了与实验室机器有类似的工作环境，我安装了 Debian Buster 和 Mate 桌面环境。本指南不涵盖 Debian 系统的安装过程，如有需要可以留言，我可以写一份安装指南。
请前往下方官网下载对应你机器架构的安装镜像。"amd64" 是 64 位处理器的名称，Intel 和 AMD 都适用。
https://www.debian.org/distrib/netinst

**[方案 A 变体] 创建自己的虚拟机并安装 Linux**
步骤不在此处展开。如有需要可以留言。

**[方案 B] 使用课程提供的虚拟机**
你可以使用课程提供的虚拟机镜像，其中已安装大部分依赖（因此你可以跳过"安装依赖库"部分），并集成了 `ece297update` 命令（因此你可以跳过"复制公共源文件"部分，改用 `ece297update`）。不过出于性能和虚拟机稳定性考虑，推荐 [方案 A] 而非 [方案 B]。如果你直接在电脑上安装 Linux，就不用操心虚拟机配置了。

- 具备 git 的基本知识，并且能够熟练使用命令行。

## 步骤

1. （使用虚拟机可跳过）在新的 Linux 系统上安装依赖
2. 复制所有"公共"源文件
3. 复制你的 mapper 源文件
4. （可选，使用虚拟机可跳过）运行单元测试

## 1. 安装依赖库

安装完 Linux 系统后，在终端中运行以下命令：

```
sudo apt update && sudo apt install build-essential curl libcurl4-gnutls-dev libboost-all-dev libreadline-dev git glade libunittest++-dev -y
```

以上命令将安装以下依赖：
- **build-essential**：包含 gcc（C 编译器）、g++（C++ 编译器）、make（编译工具）以及其他常用的代码编译工具
- **curl**：URL 解析可执行文件
- **libcurl4-gnutls-dev**：URL 解析库
- **libboost-all-dev**：libStreetDatabase 的依赖
- **libreadline-dev**：命令行读取支持
- **git**：版本控制
- **glade**：包含 GTK+3 套件
- **libunittest++-dev**：单元测试库

如果你只想运行 mapper 而不打算继续开发，不必全部安装。

## 2. 复制所有"公共"源文件

可以尝试以下两种方式：

### 方案 A：需要 Root 权限（无须改代码，但便携开发没那么方便）

```
# 创建 /cad2/ece297s/ 目录，避免 rsync 报错
sudo mkdir /cad2
sudo mkdir /cad2/ece297s

# 使用 rsync 复制"公共"源文件
sudo rsync -avhLzP -e ssh YOUR_EECG_USERNAME@ug251.eecg.utoronto.ca:/cad2/ece297s/public /cad2/ece297s/
```

### 方案 B：无须 Root 权限（推荐，方便在各种环境下开发）

```
# 创建 ~/ece297s/ 目录，避免 rsync 报错
mkdir ~/ece297s

# 使用 rsync 复制"公共"源文件
rsync -avhLzP -e ssh YOUR_EECG_USERNAME@ug251.eecg.utoronto.ca:/cad2/ece297s/public ~/ece297s/

# !! 你需要修改代码中的路径以反映变化。
# 例如，至少检查 Makefile 和 main.cpp 文件。
```

## 3. 复制你的 mapper 源文件

有两种方式将 mapper 源文件复制到你自己的电脑上：使用 Git，或使用 `rsync` 手动复制。

### 方案 A：使用 Git 备份源文件并克隆到你的电脑

强烈建议将源文件备份到 GitHub 的**私有**仓库中，这样你不用担心 2、3 年后丢失文件。

完成导入后，在你自己的电脑上克隆仓库：

```
# 链接可以在 GitHub 仓库主页的绿色 "Code" 按钮中找到
git clone https://github.com/userName/ece297example.git
```

### 方案 B：使用 "rsync" 复制文件

```
# 使用 rsync 将 mapper 源文件复制到本地电脑的主目录
rsync -avhLzP -e ssh YOUR_EECG_USERNAME@ug251.eecg.utoronto.ca:~/ece297/work/mapper ~/
```

## 4. 运行单元测试

至此，你已经从远程复制了所有必要的文件，可以安装任意 IDE 并在本地运行 mapper 了。不过，如果你想使用 `ece297exercise` 来测试代码，还需要安装以下依赖：

```
sudo apt update && sudo apt install python3 libunittest++-dev valgrind -y
```

如果你还未安装 "en_CA.UTF-8" 区域配置，也需要将其添加到系统中：

```
sudo dpkg-reconfigure locales
```
