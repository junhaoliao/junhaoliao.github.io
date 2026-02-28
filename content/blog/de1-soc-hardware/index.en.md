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
- **ICCPMR**: priority: 0 has the highest priority; only if the hardware has a priority level higher than ICCPMR, this interrupt would be triggered.
- **ICCIAR**: stores interrupt ID (who triggers interrupt)
- **ICCEOIR**: write the interrupt ID back to reset interrupt status

<image-lost-placeholder-gic-register>

**Push Button (KEY) manual:** http://www-ug.eecg.toronto.edu/msl/nios_devices/dev_pushbuttons.html

## Interval Timer

**Interval Timer manual:** http://www-ug.eecg.toronto.edu/msl/nios_devices/dev_timer.html

Q: How do you use Periodl (base+8) and Periodh (base+12)?

A: For example, if you want to load the decimal value 25000000, put the value in the red box into Periodl and the value in the blue box into Periodh — that is, put 0d381 into Periodh.

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

Regular operations are shown below (assume each snippets are from independent programs and will not affect each other):

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

#### SPSR

1. What is SPSR?
2. How many SPSRs are in the diagram below? Which mode doesn't have an SPSR?
3. Why are so many SPSRs needed?

#### Answer:

1. Saved CPSR: holds the saved processor state for the current mode.
2. 5 SPSRs. User mode does not need an SPSR.
3. Copying SPSR to CPSR restores the mode from before the switch. If User mode switches to IRQ mode, and then switches to SVC mode, SVC mode can copy SPSR_svc to CPSR to restore to IRQ mode, and IRQ mode can copy SPSR_irq to CPSR to restore to User mode.

#### SP, LR, PC

1. After switching from User mode to IRQ mode, is the current program's SP still User mode's SP?
2. After switching from User mode to IRQ mode, is the current program's LR still User mode's LR?
3. After switching from User mode to IRQ mode, is the current program's PC still User mode's PC?
4. After switching from User mode to IRQ mode, are the current program's General Registers (R0-12) still User mode's General Registers?
5. In fact, CPULator doesn't support User mode, so answer the above questions again with User mode replaced by SVC mode.

#### Answer:

1. No, it is now IRQ mode's SP.
2. No, it is now IRQ mode's LR. When first switched to IRQ mode, LR_irq gets the address of the next unexecuted instruction in User mode + 4.
3. Yes, each (single-core) processor has only one PC, pointing to the address of the next unexecuted instruction.
4. Yes, each (single-core) processor has only one set of General Registers; any mode can modify their values.
5. Replace User mode with SVC mode in the above answers; the answers remain the same.

<image-lost-placeholder-banked-registers>

## Interrupt Procedure

Prerequisites for a hardware device to trigger an interrupt:

1. The program must have a `.vector` section (also known as the "exception table")
2. The instruction at address 0x18 in the `.vector` section must be `B SERVICE_IRQ`, ensuring that when an interrupt occurs, execution correctly enters the Interrupt ReQuest handler
3. The GIC must be properly configured, and the hardware device must be set up to trigger interrupts
4. The `SERVICE_IRQ` subroutine must contain corresponding ISR handlers for each hardware device
5. Each Interrupt Service Routine must perform its task and correctly return to the Interrupt ReQuest handler

So when an interrupt occurs (suppose ICCIAR contains the value 72, meaning a KEY press triggered the interrupt):

1. The processor immediately stops what it is doing. The GIC saves the current mode's special registers (SP, PC, CPSR), switches the mode to IRQ_MODE, and sets PC to 0x18
2. The instruction at 0x18 is exactly `B SERVICE_IRQ`, so execution enters the subroutine at the `SERVICE_IRQ` label
3. Inside `SERVICE_IRQ`, first back up the data registers (R0-R10; in practice, back up only the ones you use — the professor's code recommends R0-R7). Read ICCIAR into R5 (or any other register; R5 is used here as an example), then compare it against a series of interrupt IDs
4. If R5 equals 73, enter the `KEY_ISR` subroutine
5. After `KEY_ISR` finishes its task, return to `SERVICE_IRQ`, restore the previously backed-up data registers (R0-R10), and reset the interrupt status by writing the interrupt ID (R5) back to ICCEOIR (if you skip this step, the GIC will immediately re-trigger the interrupt after exiting IRQ mode)
6. Exit the interrupt. The GIC restores SP, PC, and CPSR

## Program Counter

**Key concepts:**

About PC:

- As a register, PC stores the address of the next instruction to be executed (i.e., the instruction that is about to run but has not yet run)
- When PC appears as an operand in an instruction (e.g., `MOV R0, PC`), it represents an address equal to (the address of the current instruction + 8)

About LR:

- When executing `BL someLabel`, before branching into `someLabel`, the address of the `BL someLabel` instruction + 4 is stored in LR
- During normal program execution, if an interrupt occurs, the address of the first unexecuted instruction + 4 is stored in IRQ mode's LR

Special thanks to Dr. Henry Wong ([https://www.stuffedcow.net/](https://www.stuffedcow.net/)) who provided this perspective on Piazza in Winter 2019, even when he was not a TA at that time. He motivates me to post those review materials for free.

Original:

> This is not the official position of ECE243, but I disagree sufficiently with the way PC is taught that I think an alternative view would be useful.
> What you've learned so far is
>
> - The CPU has a set of registers,
> - at any instantaneous moment in time, each register has one value, and
> - the register values change when you execute an instruction or interrupt (or a few other things).
>
> PC isn't really a register by the above definition, and cannot be treated as one (it violates #2). ECE243 tries really hard to explain PC as if it were a register, but when you dig deep enough you're left with a bunch of inconsistencies in behaviour that are very difficult to explain away, and it's these inconsistencies that lead you to ask questions like this one and @457. Congrats on detecting the lie.
>
> What's a better explanation of PC?
>
> Each instruction is an opcode in memory, and PC is the location of the opcode. PC is not a physical object. It is just the concept of the location of an instruction. This means that questions like "What is **the value** of PC" don't make sense, but questions like "What is the PC **of this instruction**?" do make sense.
> The correct question to ask is "What value do I observe when I look at PC from some perspective?" What you observe depends on the method you use to observe it:
>
> - **From the debugger (or at instruction fetch):** PC points to the instruction that has not yet executed. This is what the debugger shows you.
> - **Reading r15 as an operand of an instruction** (e.g., mov r0, pc or ldr r0, [pc])**:** The observed value is the PC of the instruction itself + 8.
> - **Writing r15 as the destination operand of an instruction** (e.g., mov pc, lr)**:** PC points to the next instruction to execute (same as the first definition above)
> - **Branch-and-link instructions (function call):** The observed value (the value written to LR) is the PC of the instruction itself + 4.
> - **Interrupts:** The observed value (the one written to LR) is the PC of the first unexecuted instruction + 4 (so that returning to LR-4 is correct). Note that this is not the same as "PC of the last completed instruction + 8"
> - **Software exception instruction:** The observed value (written to LR) is the PC of the SVC instruction + 4.
>
> (I might be missing a few cases)
> The point is: PC is not a register, and does not have a single value. What matters is what you get when you look at "PC", and the ISA specifies all the ways you can observe "PC", the meaning of each, and offsets that depend on the method you use to observe.
>
> There are a few other imaginary things invented to fit the view of PC being a register. One of the most confusing is the concept of a "currently-executing instruction" and whether this "current instruction" is completed or aborted at an interrupt. (The logic behind it is: If we suppose that PC has a single global value, then there must be a "current" instruction related to this value, and thus we must define whether the "current" instruction is completed or aborted at an interrupt to make it consistent with the observations about LR during an interrupt). These explanations need to exist only if you try to explain PC as if it were a register. At a precise interrupt, all instructions are completed up to some point, and all instructions after that point have not executed. Then the LR is set to the PC of the first non-executed instruction + 4. I think the clearest way to express this idea is to think of interrupts as occurring in between instructions, not at an instruction that is then completed/aborted.
>
> So to directly answer your questions using the above interpretation:
>
> - If you are looking at PC from the debugger, yes. PC points to the instruction that hasn't yet executed, which is at 0x0.
> - If you're still looking at PC from the debugger, then PC would be 0x4 (the location of the instruction that hasn't yet executed) unless the instruction was a taken branch. What you were probably trying to ask was "If the instruction at 0x0 used PC as a source operand, would it see 0x8?", and the answer is yes: When reading pc as a source operand, the observed value is the PC of the instruction itself + 8.
> - BL sets LR to (location of the BL instruction + 4). Interrupts set LR to (location of first unexecuted instruction + 4).

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
