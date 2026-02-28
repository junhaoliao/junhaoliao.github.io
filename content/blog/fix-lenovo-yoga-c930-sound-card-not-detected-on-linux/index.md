---
title: "Fix Lenovo Yoga C930 'Sound Card Not Detected' on Linux"
date: "2021-08-25"
description: "A quick fix for the sound card not being detected on the Lenovo Yoga C930 running Linux."
tags: ["linux", "lenovo", "audio"]
---

Add the following line to `/etc/modprobe.d/alsa.conf`

```
options snd-hda-intel dmic_detect=0
```
