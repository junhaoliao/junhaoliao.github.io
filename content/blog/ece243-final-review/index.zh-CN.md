---
title: "ECE243 期末复习"
date: "2020-04-19"
lastModified: "2026-02-24"
description: "ECE243 期末补充复习笔记：浮点、写码技巧、I/O 设备、VGA 控制器、C 代码和中断。"
tags: ["ece243", "arm", "de1-soc", "notes"]
---

本 Review 为之前周课的补充，在阅读本 Review 之外，建议阅读其他周课课件。**底部附 aid sheet 一份。**

## 浮点的表示 (Floating Point)

浮点，即某小数在二进制里的表示。需注意大部分情况下，浮点存储的数据都只是对真实数字的一个 approximation，譬如 1/3 这个无限小数是不可能用浮点准确表达的。

### 浮点十进制与二进制的转换 (IEEE754 标准)

不想手算就用计算器：
https://www.h-schmidt.net/FloatConverter/IEEE754.html

## 写码技巧

### 程序结束

如无特殊说明，任何程序结束时都需放入一个无限循环：

a. `END: MOV PC, END`（不建议，理由见"三种方法将某地址放入某 register"。假如这是个很大的程序，这一行码会在地址 257 出现，即 END 代表 257 这个地址，compile 时会发生什么？）

b. `END: B END`（简单易用）

Q：不然会发生什么？

A："Instruction fetched from a location outside of a code section (.text or .exceptions)." 每个程序都由不同的 segment 组成。在每一个可执行程序 ELF 里，都有 header 说明各 segment 开始和结束的地址。当一个非 .text 的地址进入了 PC，debugger 就会报以上错。

![C 程序内存布局](/images/blog/ece243-final-review/memory-layout.webp)
*（来源：GeeksforGeeks）*

### 三种方法将某个地址放入某 register

a. `MOV R0, #0x10`（不建议）
墙裂不建议使用 MOV 指令对大于一个 byte (8 bits) 的数字进行操作，大部分情况下都会有 compile-time error 跟你说这个数字不能被 encode 到机械码 (opcode) 里。

b. **同时使用 MOVT 和 MOVW**（Monitor Program 的 compiler 默认的方法）
- MOVT 意为 MOV Top，能将某小于 16 bits 的数字填充进 register 的顶端 (top, 31-16 位)
- MOVW 意为 MOV Wide，能将某小于 16 bits 的数字填充进 register 的底部 (wide, 15-0 位)

示例：将 DE1-SoC 板子上的 SW 的地址 (0xff200040) 加载进 R0 register：
```armasm
MOVW R0, #0x0040
MOVT R0, #0xff20
```

练习：假设 R0 中的 data 为 0xffffffff，立即执行 `MOVW R0, #0xaaaa` 后，R0 的 data 为___

c. **使用 LDR**（pseudo instruction，简单易用，考试时写码最推荐）
```armasm
LDR R0, =0xff200040
```
注意没有 # 符号。该指令并不能直接转为一个 word 的 opcode，基本原理是在该行代码以下相差 "offset" 间距的地址放下 0xff200040 这个 word，然后使用 LDR 加载在 pc+offset 这个地址上的 word。

## I/O 设备

在 [DE1-SoC 硬件笔记](/blog/de1-soc-hardware) 讲的很细致了。

本期只提及未讲完的 VGA Controller。

### VGA (Video Graphics Array) 控制器

是个 2D-Array，通过对 320x240 个 pixel 写入颜色来实现图像显示。

#### 颜色

| 位 | 15:11 | 10:5 | 4:0 |
|----|-------|------|-----|
| 颜色 | 红 | 绿 | 蓝 |

每个 pixel 占用 16 个 bits，即一个 halfword，即两个 bytes，即占用两个地址。

我们都知道任何颜色都可以由光学三原色 (RGB) 组成。

**实现方法：通过调整各个颜色的亮度。**

对于 DE1-SoC 这个板子的颜色编码：

| 位 | 15:11 | 10:5 | 4:0 |
|----|-------|------|-----|
| 颜色 | 红 | 绿 | 蓝 |
| 100% 亮度值 | 2^5 = 32 | 2^6 = 64 | 2^5 = 32 |

由此可见，绿色比红色和蓝色能调节的精度更高。

#### 地址（方法一：不使用 Pixel Buffer Controller，不建议）

CPU 的速度比 VGA 显示的速度不一致，如果不使用 Pixel Buffer Controller，直接写到屏幕上很容易导致闪屏。

每个 pixel 都有自己的地址：

**某 Pixel 的地址 = Base Address + 该 Pixel 的地址偏移量**

直接显示的 Base Address = 0xc8000000

**偏移量（公式 = 2*x + 1024*y）**：别忘了某数乘 2 的幂就是往左的 Bit Shift。

| 位 | 31:18 | 17:10 | 9:1 | 0 |
|----|-------|-------|-----|---|
| 功能 | 0 | y [7:0] | x [8:0] | 0 |

**实操：如何在 (x=2, y=2) 显示某个骚颜色**

计算颜色表：

| 颜色 | 红 | 绿 | 蓝 |
|------|-----|------|------|
| 亮度百分比 | 20/255 | 198/255 | 211/255 |
| DE1-SoC 100% 亮度 | 32 | 64 | 32 |
| 十进制 | 32*20/255 = 3 | 64*198/255 = 50 | 32*211/255 = 26 |
| 二进制 | 0b11 | 0b110010 | 0b11010 |
| 完整 Halfword | 0b00011, 110010, 11010 |

计算地址偏移量表：

| 位 | 31:18 | 17:10 | 9:1 | 0 |
|----|-------|-------|-----|---|
| 位置 | 0 | Y = 2 | X = 2 | 0 |
| 二进制 | 0 | 0b10 | 0b10 | 0 |
| 偏移量 | 0b0000001000000010 0 |

ARM 代码：
```armasm
ldr r7, =0xc8000000  // base
ldr r1, =0b100000000100  // offset
ldr r0, =0b0001111001011010  // color
strh r0, [r7, r1]  // store as half-word
```

C 代码：
```c
volatile int VGA_base = 0xc8000000;
int offset = 0b100000000100;
short color = 0b0001111001011010;
*(short *)(VGA_base + offset) = color;
```

STRH 和 `(short*)` 很重要：一定要 store as a **halfword**，不然旁边的 pixel 会变黑。

#### 地址（方法二：使用 Pixel Buffer Controller，拒绝闪屏）

<image-lost-placeholder-vga-controller>

Buffer Register 和 Backbuffer Register 里分别装着两个不同的地址。DMA 控制器以 Buffer Register 里的 front buffer address 作为开始地址，一直读取各 pixel 的颜色并写到屏幕上，直至画完屏幕右下角的 pixel。此时，Status Register 里的 S bit 会设成 0。

往 Buffer Register 里写 1（Buffer Register 里装着的地址并不会更改，但 Status Register 里的 S 会马上变成 1），Buffer Register 和 Backbuffer Register 里的内容会互换。交换并不是在写入 1 后马上发生的，而是在 Buffer Register 里这个地址上的 buffer 的内容完全画到屏幕上后才发生的。这个**等待的时间**为 1/60 秒，也就是广为人知的**垂直同步时间** (VSync)。

## C 代码

认真看完 VGA 的例子，加上 APS105 的基础，够了。再补充点简答题可能问的：

**Volatile**（作为 qualifier）：Volatile 告诉编译器**不要优化**任何与 volatile 变量相关的东西。它不能移除内存赋值，不能缓存变量，也不能改变赋值的顺序。

## 中断

1. 硬件中断——见 [DE1-SoC 硬件笔记](/blog/de1-soc-hardware)
2. 软件中断（往年都有，去年没考）

## Aid Sheet (2019)

[下载 Aid Sheet (PDF)](/images/blog/ece243-final-review/aid-sheet.pdf)

### 推荐阅读部分

1. LDR 各种 syntax 的用法
2. SUB 各种 syntax 的用法
3. PC 的理解（正面右下角小字）
4. 常用数据表、hex-display 的 pattern（正面右侧）
