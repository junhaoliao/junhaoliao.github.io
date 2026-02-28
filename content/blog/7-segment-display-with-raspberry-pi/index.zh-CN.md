---
title: "用树莓派驱动七段数码管"
date: "2019-10-01"
lastModified: "2026-02-24"
description: "一个使用 Python 和 gpiozero 库通过树莓派驱动七段 LED 数码管的小项目。"
tags: ["raspberry-pi", "python", "hardware"]
---

这是暑假做的一个小项目，作为我学习 Python 和用于控制树莓派 GPIO 设备的 `gpiozero` 库的初步尝试。

<video controls width="100%">
  <source src="/images/blog/7-segment-display-with-raspberry-pi/demo.mp4" type="video/mp4">
</video>

面板可以显示 0x0 到 0xF 的十六进制数字/字母。

![七段数码管正面](/images/blog/7-segment-display-with-raspberry-pi/front.webp)

![七段数码管背面](/images/blog/7-segment-display-with-raspberry-pi/back.webp)

每个段由 3 个并联的 LED 组成。7 个段连接到树莓派的 GPIO 端口，通过在 LED 上产生电压差来驱动。如图所示，使用了两个公共接地以减少焊接点。

由于二极管中的电流只能从阳极流向阴极，有一个 LED 因为方向放反了而不工作。这个问题已经修复了，但我还没来得及重新录像。
