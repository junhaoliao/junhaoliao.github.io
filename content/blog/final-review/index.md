---
title: "ECE243 期末复习"
lang: "zh-CN"
date: "2020-04-19"
lastModified: "2026-02-24"
description: "ECE243 期末补充复习笔记：浮点、写码技巧、I/O 设备、VGA 控制器、C 代码和中断。"
tags: ["ece243", "arm", "de1-soc", "notes"]
---

本Review为之前周课的补充，在阅读本Review之外，建议阅读其他周课课件。**底部附aid sheet一份**

## 浮点的表示(Floating Point)

浮点，即某小数在二进制里的表示。需注意大部分情况下，浮点存储的数据都只是对真实数字的一个approximation，譬如1/3这个无限小数是不可能用浮点准确表达的。

### 浮点十进制与二进制的转换(IEEE754标准)

等下补充，不想学就用计算器算：
https://www.h-schmidt.net/FloatConverter/IEEE754.html

## 写码技巧

### 程序结束

如无特殊说明，任何程序结束时都需放入一个无限循环

a. **END: MOV PC, END**（不建议，理由见"三种方法将某地址放入某register"。假如这是个很大的程序，这一行码会在地址257出现，即END代表257这个地址，compile时会发生什么？）

b. **END: B END** (简单易用)

(
Q: 不然会发生什么？
A: "Instruction fetched from a location outside of a code section (.text or .exceptions)."
每个程序都由不同的segment组成。在每一个可执行程序ELF里，都有header说明各segment开始和结束的地址。当一个非.text的地址进入了PC，debugger就会报以上错。

**各segment的定义**

![C 程序内存布局](/images/blog/ece243-final-review/memory-layout.webp)
*(来源：GeeksforGeeks，[Memory Layout of C Programs](https://www.geeksforgeeks.org/memory-layout-of-c-program/))*

)

### 三种方法将某个地址放入某register

a. **MOV R0, #0x10** (不建议)
墙裂不建议使用MOV指令对大于一个byte (8 binary bits) 的数字进行操作，大部分情况下都会有compile-time error跟你说这个数字不能被encode到机械码(opcode)里

b. **同时使用MOVT 和MOVW** (Monitor Program的compiler默认的方法)
MOVT意为MOV Top，能将某小于16 bits的数字填充进register的顶端(top, 31-16位)
MOVW意为MOV Wide，能将某小于16 bits的数字填充进register的底部(wide, 15-0位)
示例：将DE1-SoC板子上的SW的地址(0xff200040)加载进R0 register
```armasm
MOVW R0, #0x0040
MOVT R0, #0xff20
```
练习：假设R0中的data为0xffffffff，立即执行以下指令后，R0的data为___
`MOVW R0, #0xaaaa`

c. **使用LDR**(pseudo instruction，简单易用，考试时写码最推荐)
```armasm
LDR R0, =0xff200040
```
注意没有#符号。该指令并不能直接转为一个word的opcode，基本原理是在该行代码以下相差"offset"间距的地址放下0xff200040这个word，然后使用LDR加载在pc+offset这个地址上的word。

## I/O Devices

在 [DE1-SoC 硬件笔记](/blog/de1-soc-hardware) 讲的很细致了

本期只提及未讲完的VGA Controller

### VGA (Video Graphics Array) Controller

是个2D-Array，通过对320×240个pixels写入颜色来实现图像显示。[其实DE1-SoC这块板也支持1D-Array的模式，从左上角那个点(index=0)开始画，直到右下角的点(index=76799)。据我所知课上不讲，不过要是题里如果指明把Status Register(0xFF20302C，见下面"DE1-SoC VGA Controller: Pixel buffer controller registers")里的A bit设成1，那就是用这个模式来做]

#### 颜色

| Bits | 15:11 | 10:5 | 4:0 |
|------|-------|------|-----|
| Color | Red | Green | Blue |

每个pixel占用16个bits，即一个halfword，即两个bytes，即占用两个地址

（见下，为什么pixel address的offset的Bit 0一定为0？）

我们都知道任何颜色都可以由光学三原色(Red, Green, Blue; RGB)组成。

**实现方法：通过调整各个颜色的亮度**

对于DE1-SoC这个板子的颜色编码，我们可知

| Bits | 15:11 | 10:5 | 4:0 |
|------|-------|------|-----|
| Color | Red | Green | Blue |
| Number for 100% Brightness | 2^5 = 32 | 2^6 = 64 | 2^5 = 32 |

由此可见，对于DE1-SoC这个板子，绿色 比 红色和蓝色 能调节的精度更高。

#### 地址（方法一：不使用Pixel Buffer Controller，不建议。阅读此部分后，用方法二）

CPU的速度比VGA显示的速度不一致，如果不使用Pixel Buffer Controller，直接写到屏幕上很容易导致闪屏。

每个pixel都有自己的地址：

**Some Pixel's Address = Base Address + This Pixel's Address Offset**

直接显示的Base Address = 0xc8000000

**Offset (Formula = 2*x + 1024*y)** ：别忘了某数乘2的幂就是往左的Bit Shift

| Bits | 31:18 | 17:10 | 9:1 | 0 |
|------|-------|-------|-----|---|
| Function | 0 | y [7:0] | x [8:0] | 0 |

*地址各个bits的定义*

**实操：如何在(x=2, y=2)这个位置显示下面这个骚颜色**

<image-lost-placeholder-color-picker>

*Windows Paint 的调色板调出来的骚颜色*

| Color | Red | Green | Blue |
|-------|-----|-------|------|
| % Brightness | 20/255 | 198/255 | 211/255 |
| 100% Brightness on DE1-SoC | 32 | 64 | 32 |
| Brightness on DE1-SoC in Decimal | 32*20/255 = 3 | 64*198/255 = 50 | 32*211/255 = 26 |
| Brightness on DE1-SoC in Binary | 0b11 | 0b110010 | 0b11010 |
| Complete Halfword (binary) | 0b00011, 110010, 11010 | | |

*计算颜色*

| Bits | 31:18 | 17:10 | 9:1 | 0 |
|------|-------|-------|-----|---|
| Position | 0 | Y = 2 | X = 2 | 0 |
| Position in binary | 0 | 0b10 | 0b10 | 0 |
| Offset | 0b0000001000000010 0 | | | |

*计算地址Offset*

ARM代码：
```armasm
ldr r7, =0xc8000000  // base
ldr r1, =0b100000000100  // offset
ldr r0, =0b0001111001011010  // color
strh r0, [r7, r1]  // store as half-word
```

C代码：
```c
volatile int VGA_base = 0xc8000000;
int offset = 0b100000000100;
short color = 0b0001111001011010;
*(short *)(VGA_base + offset) = color;
```

STRH和(short*) 很重要：一定要store as a **halfword**，不然旁边的pixel会变黑
(即我们往该地址写入一个word：0b 0000 0000 0000 0000 0001 1110 0101 1010
该pixel被写入一个 `0b 0001 1110 0101 1010` 的halfword，变骚颜色了
旁边的pixel被写入了一个 `0b 0000 0000 0000 0000` 的halfword，黑了)

#### 地址（方法二：使用Pixel Buffer Controller，拒绝闪屏）

<image-lost-placeholder-vga-controller>

*DE1-SoC VGA Controller: Pixel buffer controller registers*

Buffer Register和Backbuffer Register里分别装着两个不同的地址。
DMA控制器以Buffer Register里的front buffer address作为开始地址，一直读取各pixel的颜色并写到屏幕上，直至画完屏幕右下角的pixel。此时，Status Register里的S bit会设成0。
往Buffer Register里写1（Buffer Register里装着的地址并不会更改，但Status Register里的S会马上变成1），Buffer Register和Backbuffer Register里的内容会互换，即原Backbuffer里的地址会走到Buffer里，而原Buffer里的地址会走到Backbuffer里。交换并不是在写入1后马上发生的，而是在Buffer Register里这个地址上的buffer的内容完全画到屏幕上后才发生的。也就是说，只要屏幕最右下角的那个pixel还没画，这两个地址都不会交换。这个**等待的时间**为1/60秒，也就是广为人知的**垂直同步时间**（**Vertical Synchronization Time**，不打游戏就不知）。

例子：C code

////////////////////////////还没写，写完再发

## C code

认真看完VGA的例子，加上105的基础，够了。再补充点简答题可能问的：

**Volatile**(as a qualifier): Volatile tells the compiler **not to optimize** anything that has to do with the volatile variable.
It can't remove the memory assignments, it can't cache variables and it can't change the order of assignments either.

## Interrupt

1. Hardware interrupt
   [DE1-SoC 硬件笔记](/blog/de1-soc-hardware)
2. Software Interrupt（往年都有，去年没考，想看请评论）

## Aid Sheet(2019)

[下载 Aid Sheet (PDF)](/images/blog/ece243-final-review/aid-sheet.pdf)

### 推荐阅读部分：

1. LDR各种syntax的用法
2. SUB各种syntax的用法
3. PC的理解(正面右下角小字)
4. 常用数据表、hex-display的pattern(正面右侧)
