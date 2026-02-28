---
title: "ECE297 Mapper 迁移指南"
date: "2019-06-13"
lastModified: "2026-02-24"
description: "将 ECE297 Mapper 项目从多大 EECG 实验室机器迁移到本地 Debian 系统的指南。"
tags: ["tutorial", "ece297", "linux"]
---

![Mapper 截图 - 香港](/images/blog/migrating-ece297-mapper/mapper-hongkong.webp)

**声明: 我们并不拥有部分课程文件的著作权，譬如 osmXml2bin 及 EZGL 库。请不要将课程文件发布在公共库里。**

（取决于网速，本指引操作时间大约在10分钟到2小时。墙裂建议操作前完整阅读该指引，以选择更适合的方式，这样也方便排除步骤里出现的各种问题。欢迎在文章下方留言，我看到就马上回。）

传闻中课程的公共文件将在暑假时更新，我一直设法备份我们组的代码，以防日后无法编译。各种操作猛如虎之后发现还是比较容易操作的，方法分享如下。

为了操作环境与机房里更加相近，我安装了 Debian 9.9 与 Mate 桌面（想装最新版的 Debian 10 Buster 也行，亲测区别不大）。本指引不会仔细说明该系统的安装过程。有需要的话可以去下方官网下载系统镜像，记得选择正确的处理器架构。不论你是牙膏厂还是按摩店，只要是64位的通通选 "amd64"。

https://www.debian.org/distrib/netinst

## 安装依赖库

如果你在国内操作，可以考虑替换清华大学的镜像源，不然慢的像蜗牛一样。当然如果你喜欢浙大华为网易或者阿里云也行，自行百度。请根据系统版本参考：https://mirror.tuna.tsinghua.edu.cn/help/debian/

装完系统后，在终端里跑以下代码：

```
sudo apt update && sudo apt install gcc make curl libcurl4-gnutls-dev libboost-all-dev libreadline-dev git glade libunittest++-dev -y
```

以上指令会安装如下的依赖库（库名根据不同系统版本可能有变化，`apt search 关键词` 可以查一查正确完整库名）：
- **gcc** 编译C++用的
- **make** 编译程序用的
- **curl** 解析网址用的可执行文件
- **libcurl4-gnutls-dev** 解析网址用的库
- **libboost1.62-all-dev** 读数据结构 (libStreetDatabase)
- **libreadline-dev** 命令行读取
- **git** 版本控制
- **glade** 包含 GTK+3 的套件
- **libunittest++-dev** 测试代码的库

如果没打算后续开发，以上库不是必须全部安装。但不想出问题的话那还是全部装好了。

## 从远程机器复制文件

如果不熟悉终端指令的话，可以尝试以下两种方式：

### A. 需要 Root 权限（无须改代码，但便携开发没那么方便）

1. 在本地机子上任意位置创建一个叫 "public" 的文件夹。
2. 在终端里输入 `caja` 并回车（Mate 桌面的资源管理器）。
3. 在地址栏中输入 `sftp://ugXXX.eecg.toronto.edu` 并回车。
4. 将 "ece297" 从远程机房的用户目录，复制到本地用户目录下。
5. 前往 `cad2/ece297s/public`，复制所有文件和文件夹到第1步创建的 "public" 文件夹中。
6. 在终端里输入 `sudo caja` 并回车，即以 Root 权限启动资源管理器。前往根目录（"/"）创建一个叫 "cad2" 的文件夹，在这个 "cad2" 文件夹里创建一个叫 "ece297s" 的文件夹。
7. 复制 "public"（参考第1、第5步）至 "ece297s"（参考第6步）。

### B. 无须 Root 权限（推荐，方便在各种环境下开发）

1. 参考 A 方法的 1-4 步，将 mapper 的代码复制到本地。（或者我就推荐直接用备份好了）
2. 打开 mapper 文件夹，粘贴解压后的 "cad2" 文件夹。
3. 将代码里 cad2 的对应路径更改。譬如至少查下 Makefile 和 `main.cpp`。

到此你已经复制了所有必要的文件。你可以装任意开发软件并在本地调试你的 mapper 了。

## 使用 "ece297exercise"

安装以下依赖：

```
sudo apt update && sudo apt install libunittest++-dev valgrind -y
```

如果你还未安装地区配置 "en_CA.UTF-8" 的话，你也需要安装此配置到系统里：

```
sudo dpkg-reconfigure locales
```
