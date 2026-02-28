---
title: "ECE344 ASST3"
date: "2021-03-13"
description: "Notes on implementing OS/161 system calls for ECE344 Assignment 3, covering argument passing, fork, waitpid, exit, and execv."
tags: ["ece344", "os161", "operating-systems", "uoft"]
---

**Modify kern/userprog/runprogram.c to enable passing argc and argv**

Passed:

- asst3-01-addtest.py (5)
- asst3-02-argtest.py (6)

**Implement thread table, modify thread_init, thread_create; implement md_forkentry(), syscall fork() & getpid()**

Passed:

- asst3-03-forktest.py (15)
- asst3-04-forkbomb.py (8)

**Implement waitpid(), exit(), change kill_curthread() in trap.c**

- asst3-05-crash.py (13)
- some asst3-07-wait.py

**Check arguments in waitpid()**

os161/testbin/badcall/bad_waitpid.c

Passed:

- some asst3-06-badcall.py (12 out of 21)
- asst3-07-wait.py (18)

**Implement execv() and check the arguments**

Passed:

- all
