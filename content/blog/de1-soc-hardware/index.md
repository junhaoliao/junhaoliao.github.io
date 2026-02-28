---
title: "DE1-SoC Hardware"
date: "2020-03-15"
lastModified: "2026-02-24"
description: "Notes on DE1-SoC hardware for ECE243: GIC, interval timer, CPSR, stack pointer, banked registers, interrupt procedure, program counter, and VGA."
tags: ["ece243", "arm", "de1-soc", "notes"]
---

## General Interrupt Controller

Polling: keep waiting, waste of resources

Interrupt: keep doing other things until interruption

Manual: ftp://192.198.164.82/pub/fpgaup/pub/Intel_Material/15.0/Tutorials/Using_GIC.pdf

- **ICCICR**: must be set to 1 so that interrupt can happen
- **ICCPMR**: priority — 0 has the highest priority; only if the hardware has a priority level higher than ICCPMR, this interrupt would be triggered.
- **ICCIAR**: stores interrupt ID (who triggers interrupt)
- **ICCEOIR**: write the interrupt ID back to reset interrupt status

<image-lost-placeholder-gic-register>

**Push Button (KEY) manual:** http://www-ug.eecg.toronto.edu/msl/nios_devices/dev_pushbuttons.html

## Interval Timer

**Interval Timer manual:** http://www-ug.eecg.toronto.edu/msl/nios_devices/dev_timer.html

Q: How to use Periodl (base+8) and Periodh (base+12)?

A: For example, if you want to load the decimal number 25000000, put the lower 16 bits into Periodl and the upper 16 bits (0x0d381) into Periodh — essentially split the 32-bit value into two halves.

<image-lost-placeholder-interval-timer-left>

<image-lost-placeholder-interval-timer-right>

## CPSR

**CPSR (ARM):** https://developer.arm.com/docs/ddi0595/b/aarch32-system-registers/cpsr

Masked = Disabled

### [7] Interrupt Disable

Interrupt should be set to disabled (I=1) until all hardware you use (KEYs, Timers) has enabled interrupt-trigger.

| I | Meaning |
|---|---------|
| 0x0 | Exception not masked |
| 0b1 | Exception masked |

### [6] Fast Interrupt Disable

| F | Meaning |
|---|---------|
| 0x0 | Exception not masked |
| **0b1** | Exception masked (set to 1 in ECE243) |

### [5] Thumb Enable

| T | Meaning |
|---|---------|
| **0x0** | Thumb mode disabled (set to 0 in ECE243) |
| 0b1 | Thumb mode enabled |

### [4:0] Mode Bits

| Mode | Bits | Description |
|------|------|-------------|
| **User** | 10000 | Normal program execution, no privileges |
| FIQ | 10001 | Fast interrupt handling |
| **IRQ** | 10010 | Normal interrupt handling |
| **Supervisor** | 10011 | Privileged mode for the operating system |
| Abort | 10111 | For virtual memory and memory protection |
| Undefined | 11011 | Facilitates emulation of co-processors in hardware |
| System | 11111 | Runs programs with some privileges |

## Stack Pointer

You can modify SP at any time. You can even treat SP as a regular register if you don't need a stack in your program (which is usually a bad programming style and thus not recommended).

Regular operations are shown below (assume each snippet is from an independent program):

```armasm
// backup and restore R0
PUSH {R0}
...
POP {R0}

// backup R0, and restore its backup value into R1
PUSH {R0}
...
POP {R1}

// backup LR, and restore its backup value into PC
// Think again. What exactly is this doing?
BL someSubroutine // LR gets the address of "here"
here: ...

someSubroutine:
PUSH {LR}
...
BL anotherSubroutine // LR gets the address of "there"
there:
...
POP {PC} // POP {LR}; MOV PC, LR

anotherSubroutine:
...
BX LR

// When the system starts, the default value of SP
//  on our DE1-SOC machine is 0x1 0000 0000
// (Well you can say it is 0x0000 0000 if you want)
// What if I want to modify it? Try step into each of below instructions
LDR SP,=256 // 256=0x100
MOV R0,#1
PUSH {R0} // What is the content at 0x100-4
POP {R0} // What is the content at 0x100-4

// What is the value of R1, R2 and R3?
MOV R1, #1
MOV R2, #2
MOV R3, #3

PUSH {R1-R3}
POP {R2,R3,R1}

// 3 => R2
// 2 => R3
// 1 => R1
// initial stack pointer => end stack pointer
```

## Banked Registers

Helps you to switch between modes.

### SPSR

1. What is SPSR?
2. How many SPSRs are in the diagram below? Who doesn't have an SPSR?
3. Why do we need so many SPSRs?

**Answers:**

1. Saved CPSR: Holds the saved process state for the current mode.
2. 5 SPSRs. User mode does not need an SPSR.
3. Copying SPSR to CPSR restores the mode before the switch. If User mode switches to IRQ mode, then to SVC mode: SVC mode can copy SPSR_svc to CPSR to restore IRQ mode, and IRQ mode can copy SPSR_irq to CPSR to restore User mode.

### SP, LR, PC

1. After switching from User mode to IRQ mode, is the current SP still User mode's SP?
2. After switching from User mode to IRQ mode, is the current LR still User mode's LR?
3. After switching from User mode to IRQ mode, is the current PC still User mode's PC?
4. After switching from User mode to IRQ mode, are the current General Registers (R0-12) still User mode's General Registers?
5. Since CPULator doesn't support User mode, replace "User mode" with "SVC mode" and answer again.

**Answers:**

1. No. It is now IRQ mode's SP.
2. No. It is now IRQ mode's LR. When first switched to IRQ mode, LR_irq gets the address of the unexecuted instruction in User mode + 4.
3. Yes. Each (single-core) processor has only one PC, pointing to the next unexecuted instruction.
4. Yes. Each (single-core) processor has only one set of General Registers. Any mode can modify their values.
5. Replacing User mode with SVC mode, the answers remain the same.

<image-lost-placeholder-banked-registers>

## Interrupt Procedure

Prerequisites for a hardware device to trigger an interrupt:

1. The program has a `.vector` section (also called "exception table")
2. The instruction at address 0x18 in the `.vector` section is `B SERVICE_IRQ`, ensuring the processor correctly enters the IRQ handler when an interrupt occurs
3. The GIC is correctly configured, and the hardware device has interrupt-trigger enabled
4. The `SERVICE_IRQ` subroutine has corresponding ISR handlers for each hardware device
5. The Interrupt Service Routine does what needs to be done and correctly returns to the IRQ handler

When an interrupt occurs (assuming ICCIAR value is 72, i.e., a KEY press triggered the interrupt):

1. The processor immediately stops the current work. The GIC saves the current mode's special registers (SP, PC, CPSR), switches to IRQ_MODE, and sets PC to 0x18.
2. At 0x18 is `B SERVICE_IRQ` — we enter the SERVICE_IRQ subroutine.
3. In SERVICE_IRQ, first backup data registers (R0-R10, or however many you use), read ICCIAR into R5 (or another register), and compare against a series of interrupt IDs.
4. If R5 equals 73, enter the KEY_ISR subroutine.
5. After KEY_ISR finishes, return to SERVICE_IRQ, restore the backed-up data registers, and write the interrupt ID (R5) back to ICCEOIR to reset the interrupt status (otherwise, after exiting IRQ, the GIC will immediately trigger the interrupt again).
6. Exit interrupt. The GIC restores SP, PC, and CPSR.

## Program Counter

**Key points about PC:**

- As a register, PC stores the address of the next instruction to be executed (fetched but not yet executed).
- When PC appears as op2 in an instruction (e.g., `MOV R0, PC`), PC represents an address equal to (this instruction's address + 8).

**Key points about LR:**

- When executing `BL someLabel`, before branching into someLabel, the address of the BL instruction + 4 is stored in LR.
- During normal execution, if an interrupt occurs, the address of the first unexecuted instruction + 4 is stored in IRQ mode's LR.

## VGA

http://www-ug.eecg.utoronto.ca/desl/nios_devices_SoC/dev_vga.html

```armasm
.global _start
_start:
	// using this address to write directly to the buffer
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
