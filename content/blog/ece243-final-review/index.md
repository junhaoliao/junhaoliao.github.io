---
title: "ECE243 Final Review"
date: "2020-04-19"
lastModified: "2026-02-24"
description: "Supplementary review notes for ECE243 final exam: floating point, coding tips, I/O devices, VGA controller, C code, and interrupts."
tags: ["ece243", "arm", "de1-soc", "notes"]
---

This review supplements the weekly lecture materials. In addition to this review, it is recommended to read the other weekly lecture slides. **An aid sheet is attached at the bottom.**

## Floating Point

Floating point refers to the binary representation of decimal numbers. Note that in most cases, floating point storage is only an approximation of the real number — for example, the infinite decimal 1/3 cannot be accurately represented in floating point.

### IEEE 754 Conversion

If you don't want to do the conversion manually, use this calculator:
https://www.h-schmidt.net/FloatConverter/IEEE754.html

## Coding Tips

### Program Termination

Unless otherwise specified, every program should end with an infinite loop:

a. `END: MOV PC, END` (not recommended — see "Three ways to load an address into a register". If this line appears at address 257, what happens at compile time?)

b. `END: B END` (simple and easy to use)

Q: What happens if you don't add this?

A: "Instruction fetched from a location outside of a code section (.text or .exceptions)." Every program consists of different segments. Each executable ELF has headers specifying the start and end addresses of each segment. When an address outside .text enters PC, the debugger reports the above error.

![Memory Layout of C Programs](/images/blog/ece243-final-review/memory-layout.webp)
*(Source: GeeksforGeeks)*

### Three Ways to Load an Address into a Register

a. `MOV R0, #0x10` (not recommended)
Strongly not recommended for numbers larger than one byte (8 bits). In most cases, you'll get a compile-time error saying the number can't be encoded into the opcode.

b. **Use MOVT and MOVW together** (Monitor Program's compiler default method)
- MOVT (MOV Top): fills a value smaller than 16 bits into the top half of the register (bits 31-16)
- MOVW (MOV Wide): fills a value smaller than 16 bits into the bottom half of the register (bits 15-0)

Example: Load the DE1-SoC switch (SW) address (0xff200040) into R0:
```armasm
MOVW R0, #0x0040
MOVT R0, #0xff20
```

Exercise: If R0 contains 0xffffffff, what is R0 after executing `MOVW R0, #0xaaaa`?

c. **Use LDR** (pseudo instruction, simple and easy — most recommended for exams)
```armasm
LDR R0, =0xff200040
```
Note: no `#` symbol. This instruction can't be directly converted to a single word opcode. The basic principle is to place the word 0xff200040 at an address some "offset" below this line of code, then use LDR to load the word at pc+offset.

## I/O Devices

Covered in detail in the [DE1-SoC Hardware](/blog/de1-soc-hardware) post.

This section only covers the VGA Controller.

### VGA (Video Graphics Array) Controller

A 2D array that displays images by writing colors to 320x240 pixels.

#### Colors

| Bits | 15:11 | 10:5 | 4:0 |
|------|-------|------|-----|
| Color | Red | Green | Blue |

Each pixel uses 16 bits (one halfword / two bytes / two addresses).

We know any color can be composed from the optical primary colors (Red, Green, Blue; RGB).

**Method: Adjust the brightness of each color component.**

For the DE1-SoC color encoding:

| Bits | 15:11 | 10:5 | 4:0 |
|------|-------|------|-----|
| Color | Red | Green | Blue |
| 100% Brightness | 2^5 = 32 | 2^6 = 64 | 2^5 = 32 |

Green has higher precision than Red and Blue on this board.

#### Addresses (Method 1: Without Pixel Buffer Controller — not recommended)

The CPU speed doesn't match VGA display speed. Without the Pixel Buffer Controller, writing directly to the screen easily causes flickering.

Each pixel has its own address:

**Pixel Address = Base Address + Offset**

Direct display Base Address = 0xc8000000

**Offset (Formula = 2*x + 1024*y)**: Remember that multiplying by a power of 2 is a left bit shift.

| Bits | 31:18 | 17:10 | 9:1 | 0 |
|------|-------|-------|-----|---|
| Function | 0 | y [7:0] | x [8:0] | 0 |

**Example: Display a color at position (x=2, y=2)**

Color calculation:

| Color | Red | Green | Blue |
|-------|-----|-------|------|
| % Brightness | 20/255 | 198/255 | 211/255 |
| 100% on DE1-SoC | 32 | 64 | 32 |
| Decimal | 32*20/255 = 3 | 64*198/255 = 50 | 32*211/255 = 26 |
| Binary | 0b11 | 0b110010 | 0b11010 |
| Complete Halfword | 0b00011, 110010, 11010 |

Address Offset calculation:

| Bits | 31:18 | 17:10 | 9:1 | 0 |
|------|-------|-------|-----|---|
| Position | 0 | Y = 2 | X = 2 | 0 |
| Binary | 0 | 0b10 | 0b10 | 0 |
| Offset | 0b0000001000000010 0 |

ARM code:
```armasm
ldr r7, =0xc8000000  // base
ldr r1, =0b100000000100  // offset
ldr r0, =0b0001111001011010  // color
strh r0, [r7, r1]  // store as half-word
```

C code:
```c
volatile int VGA_base = 0xc8000000;
int offset = 0b100000000100;
short color = 0b0001111001011010;
*(short *)(VGA_base + offset) = color;
```

Important: Use STRH and `(short*)` — you must store as a **halfword**, otherwise the adjacent pixel will turn black.

#### Addresses (Method 2: Using Pixel Buffer Controller — no flickering)

<image-lost-placeholder-vga-controller>

The Buffer Register and Backbuffer Register each hold a different address. The DMA controller reads pixel colors starting from the front buffer address in the Buffer Register, writing to the screen until the bottom-right pixel is drawn. At that point, the S bit in the Status Register is set to 0.

Writing 1 to the Buffer Register (the address in it doesn't change, but S immediately becomes 1) triggers a swap between the Buffer and Backbuffer contents. The swap doesn't happen immediately — it occurs only after the buffer content is fully drawn to the screen. This waiting time is 1/60 second, the well-known **Vertical Synchronization Time** (VSync).

## C Code

After reading the VGA examples thoroughly, combined with APS105 basics, that should be sufficient. Additional topics for potential short-answer questions:

**Volatile** (as a qualifier): Volatile tells the compiler **not to optimize** anything related to the volatile variable. It can't remove the memory assignments, it can't cache variables, and it can't change the order of assignments either.

## Interrupts

1. Hardware interrupt — see [DE1-SoC Hardware](/blog/de1-soc-hardware)
2. Software Interrupt (appeared in past exams)

## Aid Sheet (2019)

[Download Aid Sheet (PDF)](/images/blog/ece243-final-review/aid-sheet.pdf)

### Recommended Sections

1. Various LDR syntax usage
2. Various SUB syntax usage
3. Understanding PC (small text on the bottom right of front page)
4. Common data tables, hex-display patterns (right side of front page)
