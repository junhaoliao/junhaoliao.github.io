---
title: "Build Python 3 on Linux"
date: "2021-08-25"
description: "Configure flags for building Python 3 from source on Linux with optimizations and shared libraries."
tags: ["linux", "python"]
---

Reference for installing dependencies: https://devguide.python.org/setup/#install-dependencies

```bash
./configure --enable-optimizations --with-lto --enable-shared --prefix=/opt/python LDFLAGS=-Wl,-rpath=/opt/python/lib
```
