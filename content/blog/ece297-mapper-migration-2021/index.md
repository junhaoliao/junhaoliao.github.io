---
title: "ECE297 Mapper Migration (2021)"
date: "2021-05-01"
lastModified: "2026-02-24"
description: "Updated guide (2021) for migrating the ECE297 mapper project from UofT EECG lab machines to a local Linux installation."
tags: ["tutorial", "ece297", "linux"]
---

![Mapper Screenshot - Toronto](/images/blog/ece297-mapper-migration-2021/mapper-toronto.webp)

**Disclaimer: Please keep in mind we do not own the copyrights of some course files such as osmXml2bin and the EZGL library. Please do not post any course files in a public repository.**

## Before you read ...

Depending on your network connection, the below may take 10-15 minutes. It is strongly recommended to read the full guide before you proceed, so that you can select better approaches. It should also help you to debug any problem you encounter in the steps. You are also welcome to leave a comment here or on my main page. I will respond to you as soon as I am available.

## Background

Since the course files will be modified during this summer, many of us might want to backup our work onto our own machines. With the steps specified below, we will be able to make our mapper runnable again on our Linux installations, either on a bare computer or in a Virtual Machine (VM).

## Requirements

- A Linux Operating System installed. You can either perform a bare metal installation on your computer or use the VM provided by the course instructors.

**[Approach A, Recommended] Install Linux directly on your computer.**
To achieve a similar working environment with the lab machines, I installed Debian Buster with the Mate Desktop Environment. The installation of the Debian system is not covered here, but feel free to post a followup if you want me to write the steps down.
Please go to the official website below and download the installation image corresponding to the architecture of your machine. "amd64" is the name for 64-bit processors, both Intel and AMD.
https://www.debian.org/distrib/netinst

**[Approach A Variant] Create Your Own VM and Install Linux**
Steps are not covered here. Feel free to post a followup if you want me to write the steps down.

**[Approach B] Use the course VM**
You may use the VM image provided by the course instructors, which has most of the dependencies installed (so you can skip the "Setting up dependencies" section) and the `ece297update` command integrated (so you can skip the "Copying all the 'public' source files" section, and use `ece297update` instead). However, for performance and VM stability reasons, [Approach A] is recommended over [Approach B]. You don't have to worry about VM configurations if you install Linux directly on your computer.

- Basic knowledge of git. You should be comfortable working with the command line as well.

## Steps

1. (Skippable if you use the VM) Setting up the dependencies on the new Linux installation
2. Copying all the "public" source files
3. Copying all your mapper source files
4. (Optional, skippable if you use the VM) Running the unit tests

## 1. Setting up dependencies

After the Linux system installation, run the following in the terminal:

```
sudo apt update && sudo apt install build-essential curl libcurl4-gnutls-dev libboost-all-dev libreadline-dev git glade libunittest++-dev -y
```

For your reference, the above command will install the following dependencies:
- **build-essential**: includes gcc (C compiler), g++ (C++ compiler), make (utility for directing compilation) and other tools that are commonly used for code compilation
- **curl**: URL resolver executable
- **libcurl4-gnutls-dev**: URL resolver library
- **libboost-all-dev**: dependency of libStreetDatabase
- **libreadline-dev**: support reading from command line
- **git**: version control
- **glade**: includes the GTK+3 suite
- **libunittest++-dev**: unit test library

It is not necessary to install all of them if you only want to run your mapper without continuous development.

## 2. Copying all the "public" source files

You can try one of the following two approaches:

### Approach A. With Root Access (no need to modify your code, but less convenient for portable development)

```
# create /cad2/ece297s/ so that "rsync" doesn't complain about the missing directories
sudo mkdir /cad2
sudo mkdir /cad2/ece297s

# use rsync to copy the "public" source files
sudo rsync -avhLzP -e ssh YOUR_EECG_USERNAME@ug251.eecg.utoronto.ca:/cad2/ece297s/public /cad2/ece297s/
```

### Approach B. Without Root Access (Recommended approach for various environments)

```
# create ~/ece297s/ so that "rsync" doesn't complain about the missing directories
mkdir ~/ece297s

# use rsync to copy the "public" source files
rsync -avhLzP -e ssh YOUR_EECG_USERNAME@ug251.eecg.utoronto.ca:/cad2/ece297s/public ~/ece297s/

# !! You will need to modify your code to reflect the path change.
# For example, you should check the Makefile and your main.cpp file.
```

## 3. Copying all your mapper source files

There are two ways to copy your mapper source files onto your own computer: Use Git, or copy manually using `rsync`.

### Approach A. Use Git to backup your source files and clone it onto your computer

You are strongly recommended to backup your source files in a GitHub **private** repository, so that you don't have to worry about losing your files in 2 or 3 years.

Once you have done the importation, clone the repo on your own computer:

```
# the link can be found in the "Code" green button on the main page of your GitHub repo
git clone https://github.com/userName/ece297example.git
```

### Approach B. Copy the files using "rsync"

```
# use rsync to copy the mapper source files to the local computer's home directory
rsync -avhLzP -e ssh YOUR_EECG_USERNAME@ug251.eecg.utoronto.ca:~/ece297/work/mapper ~/
```

## 4. Running the unit tests

Now that you have done copying all the necessary files from the remote, you can install any IDE you want and try running the mapper on your local PC now. However, if you would like to use `ece297exercise` to test your code, you will need to install these dependencies:

```
sudo apt update && sudo apt install python3 libunittest++-dev valgrind -y
```

Also you need to add the "en_CA.UTF-8" locale to your system, if you haven't done so:

```
sudo dpkg-reconfigure locales
```
