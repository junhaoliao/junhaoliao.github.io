---
title: "DE1-SoC 硬件笔记"
date: "2020-03-15"
lastModified: "2026-02-24"
description: "ECE243 DE1-SoC 硬件笔记：GIC、间隔定时器、CPSR、堆栈指针、分组寄存器、中断流程、程序计数器和 VGA。"
tags: ["ece243", "arm", "de1-soc", "notes"]
---

## 通用中断控制器 (GIC)

轮询 (Polling)：一直等待，浪费资源

中断 (Interrupt)：继续做其他事情，直到被中断

手册：ftp://192.198.164.82/pub/fpgaup/pub/Intel_Material/15.0/Tutorials/Using_GIC.pdf

- **ICCICR**：必须设为 1 才能触发中断
- **ICCPMR**：优先级——0 为最高优先级；只有硬件的优先级高于 ICCPMR 时，才会触发中断
- **ICCIAR**：存储中断 ID（谁触发了中断）
- **ICCEOIR**：将中断 ID 写回以重置中断状态

<image-lost-placeholder-gic-register>

**按键 (KEY) 手册：** http://www-ug.eecg.toronto.edu/msl/nios_devices/dev_pushbuttons.html

## 间隔定时器 (Interval Timer)

**间隔定时器手册：** http://www-ug.eecg.toronto.edu/msl/nios_devices/dev_timer.html

Q：Periodl (base+8) 和 Periodh (base+12) 怎样用？

A：譬如你想放十进制为 25000000 的数进去，低 16 位放 Periodl，高 16 位（0x0d381）放 Periodh——就是把 32 位的值分成两半。

<image-lost-placeholder-interval-timer-left>

<image-lost-placeholder-interval-timer-right>

## CPSR

**CPSR (ARM)：** https://developer.arm.com/docs/ddi0595/b/aarch32-system-registers/cpsr

Masked = 禁用

### [7] 中断禁用位

在所有你使用的硬件（KEY、Timer）都启用中断触发之前，中断应设为禁用 (I=1)。

| I | 含义 |
|---|------|
| 0x0 | 异常未屏蔽 |
| 0b1 | 异常已屏蔽 |

### [6] 快速中断禁用位

| F | 含义 |
|---|------|
| 0x0 | 异常未屏蔽 |
| **0b1** | 异常已屏蔽（ECE243 中设为 1） |

### [5] Thumb 使能位

| T | 含义 |
|---|------|
| **0x0** | Thumb 模式禁用（ECE243 中设为 0） |
| 0b1 | Thumb 模式启用 |

### [4:0] 模式位

| 模式 | 位 | 描述 |
|------|-----|------|
| **User** | 10000 | 正常程序执行，无特权 |
| FIQ | 10001 | 快速中断处理 |
| **IRQ** | 10010 | 普通中断处理 |
| **Supervisor** | 10011 | 操作系统的特权模式 |
| Abort | 10111 | 虚拟内存和内存保护 |
| Undefined | 11011 | 协处理器硬件仿真 |
| System | 11111 | 以部分特权运行程序 |

## 堆栈指针 (SP)

你可以随时修改 SP。如果程序中不需要栈，你甚至可以把 SP 当作普通寄存器来用（但这通常是不好的编程习惯，不推荐）。

常规操作如下（假设每个代码片段来自独立的程序）：

```armasm
// 备份和恢复 R0
PUSH {R0}
...
POP {R0}

// 备份 R0，将备份值恢复到 R1
PUSH {R0}
...
POP {R1}

// 备份 LR，将备份值恢复到 PC
// 想想看，这到底在做什么？
BL someSubroutine // LR 获取 "here" 的地址
here: ...

someSubroutine:
PUSH {LR}
...
BL anotherSubroutine // LR 获取 "there" 的地址
there:
...
POP {PC} // POP {LR}; MOV PC, LR

anotherSubroutine:
...
BX LR

// 系统启动时，DE1-SOC 机器上 SP 的默认值
//  为 0x1 0000 0000
// （你也可以说是 0x0000 0000）
// 如果我想修改它呢？尝试单步执行以下指令
LDR SP,=256 // 256=0x100
MOV R0,#1
PUSH {R0} // 0x100-4 处的内容是什么
POP {R0} // 0x100-4 处的内容是什么

// R1、R2 和 R3 的值分别是多少？
MOV R1, #1
MOV R2, #2
MOV R3, #3

PUSH {R1-R3}
POP {R2,R3,R1}

// 3 => R2
// 2 => R3
// 1 => R1
// 初始栈指针 => 结束栈指针
```

## 分组寄存器 (Banked Registers)

帮助你在不同模式之间切换。

### SPSR

1. 什么是 SPSR？
2. 下图有多少个 SPSR？谁没有 SPSR？
3. 为什么需要这么多个 SPSR？

**答案：**

1. Saved CPSR：保存当前模式的处理器状态。
2. 5 个 SPSR，User mode 并不需要 SPSR。
3. 将 SPSR 复制到 CPSR 即可还原到切换前的 mode。如果 User mode 切换到 IRQ mode 后，又被切换到 SVC mode；那 SVC mode 下可将 SPSR_svc 复制到 CPSR 来还原到 IRQ mode，IRQ mode 下可将 SPSR_irq 复制到 CPSR 来还原到 User mode。

### SP、LR、PC

1. 从 User mode 切换到 IRQ mode 后，当前执行程序的 SP 还是 User mode 的 SP 吗？
2. 从 User mode 切换到 IRQ mode 后，当前执行程序的 LR 还是 User mode 的 LR 吗？
3. 从 User mode 切换到 IRQ mode 后，当前执行程序的 PC 还是 User mode 的 PC 吗？
4. 从 User mode 切换到 IRQ mode 后，当前执行程序的 General Registers (R0-12) 还是 User mode 的 General Registers 吗？
5. 事实上 CPULator 并不支持 User mode，所以前面的题把 User mode 换成 SVC mode 再答一遍。

**答案：**

1. 不是，这时是 IRQ mode 的 SP。
2. 不是，这时是 IRQ mode 的 LR。刚被切换到 IRQ mode 时，LR_irq 会获得 User mode 里还没执行的指令的地址 + 4。
3. 是的，每个（单核心）处理器 PC 只有一个，指向下一个还未执行的指令的地址。
4. 是的，每个（单核心）处理器只有一套 General Registers，任意 mode 都可以更改它们的值。
5. 把以上答案中 User mode 换成 SVC mode，答案一样。

<image-lost-placeholder-banked-registers>

## 中断流程

如果想要某硬件能触发 interrupt，必要条件：

1. 程序中有 `.vector` 这个 section（也称 "exception table"）
2. `.vector` section 中 0x18 这行地址的指令为 `B SERVICE_IRQ`，确保能在 interrupt 发生时正确进入 IRQ handler
3. GIC 有正确设置，且该硬件设置了会触发 interrupt
4. `SERVICE_IRQ` 的 subroutine 里，各硬件有对应的 ISR handler
5. Interrupt Service Routine 里做想做的事，并能够正确返回到 IRQ handler

所以当某个 interrupt 发生时（假设 ICCIAR 里值为 72，即按下了某 KEY 触发了 interrupt）：

1. 处理器会马上停下现在做的事，GIC 会保存好当前 mode 的特殊 register (SP, PC, CPSR)，切换 mode 为 IRQ_MODE，PC 值变为 0x18
2. 0x18 正正是 `B SERVICE_IRQ`，我们会进入 SERVICE_IRQ 这个 label 所对应的 subroutine
3. 在 SERVICE_IRQ 里，先备份好数据 register (R0-R10)，读取 ICCIAR 到 R5，并与一系列 interrupt id 对比
4. 如果 R5 的值为 73，则进入 KEY_ISR 这个 subroutine
5. KEY_ISR 做完想做的事之后，返回 SERVICE_IRQ 里，还原之前备份的数据 register，通过将 interrupt id (R5) 写回 ICCEOIR 的方式重置 interrupt status（如果不这样做，退出 IRQ 之后 GIC 马上又会激活 interrupt）
6. 退出 interrupt，GIC 帮忙还原 SP、PC、CPSR

## 程序计数器 (PC)

**核心观点：**

关于 PC：

- PC 作为 register 存储的是下一个要跑的 instruction（要执行但还未执行的 instruction）的地址
- PC 作为 op2 在 instruction 里出现时（`MOV R0, PC`），则 PC 代表一个地址，为（这一行 instruction 的地址 + 8）

关于 LR：

- 在执行 `BL someLabel` 时，在 branch into someLabel 之前，BL someLabel 这一行 opcode 的地址 + 4 被储存在 LR 中
- 在执行普通程序时，如果发生 interrupt，第一个未执行的指令的地址 + 4 被储存在 IRQ mode 的 LR 中

## VGA

http://www-ug.eecg.utoronto.ca/desl/nios_devices_SoC/dev_vga.html

```armasm
.global _start
_start:
	// 使用此地址直接写入缓冲区
	ldr r7,=0xc8000000
	ldr r0,=0b11111

BLUE:
	LDR R1,xOffset
	ADD R1, #1
	STR R1,xOffset
	CMP R1, #320
	BLEQ ADD_Y

	LSL R1, #1

	LDR R2,yOffset
	LSL R2,#10

	ORR R1,R2

	STRH R0, [r7,R1]
	B BLUE

ADD_Y:
	MOV R1, #0
	STR R1,xOffset

	LDR R2, yOffset
	ADD R2,#1
	STR R2, yOffset

	CMP R2, #240
	BEQ DONE
	BX LR

DONE: B DONE

xOffset:
	.word 0
yOffset:
	.word 0
```
