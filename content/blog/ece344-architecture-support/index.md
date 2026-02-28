---
title: "ECE344: Architecture Support"
date: "2021-01-24"
description: "Notes on OS architecture support for ECE344: kernel vs user mode, privileged instructions, CPU mode switching, event handling, TRAP instructions, and threads."
tags: ["ece344", "operating-systems", "notes"]
---

## Architecture Support

1. When we talk about "OS", most of the time we mean "kernel". (Safari is not part of an "OS", rather it is a user program.)
When we say "privileged instructions", we mean the instructions that can only run under kernel mode.

2. User vs kernel mode instructions

- User Mode operations (also available to kernel mode)

a. load: read a value from memory into a register
b. store: write a value from a register into memory
c. modify general purpose registers: storing the operands of the instructions
d. modify stack pointer register(SP): every user program has its own stack and therefore should be able to access the stack by modifying the SP
e. push and pop:
"push" decrement the stack pointer and store some register's value into the stack
"pop" increments the stack pointer (note that nothing gets erased)
similar reason to d)
f. modify program counter register (PC) / jump in MIPS/ jmp in x86 / b(branch) in ARM:
tell cpu where's the next line to execute. useful for calling subroutines(functions in our own code or syscalls)
g. TRAP: used only by user programs to make system calls. According to lrb, if the kernel calls this instruction, the behaviour is undefined.

- Kernel mode operations (only the kernel can do it)

a. perform Input / Output (I/O): only the kernel can read/write to files.
Q: However, why a user mode program is able to call printf() to print (write to stdout)?
A: The user is able to write to stdout by calling system calls (syscalls). Although printf() is not syscall, it is a Standard Library call and calls the syscall write() to perform the write into stdout. The kernel is required to check the arguments of syscall write() so that no user program can corrupt the files by passing malicious arguments.
b. modify the register that controls kernel/user mode; modify the mode bits in CPSR in ARM; modify status registers:
Those registers control the CPU status and therefore should not be modified by user programs, or any user program can change mode and run the privileged instructions in kernel mode.
c. Enabling/Disabling Interrupt in the status register: only the kernel should be able to do it, or some malicious user program can disable (timer) interrupt. If timer interrupts don't happen, the kernel is not able to retain control of the CPU, and the user program can occupy the CPU forever.
d. HALT instruction: it stops the CPU until the next interrupt happens. Doesn't it sound dangerous if a malicious user program can stop the CPU?

3. When does the CPU switch from user mode to kernel mode? (What are those "events"?)

- exception(**sync**, which means things happen as the program runs, so it must be some line in the codes causing the exception): if it is unexpected, we call it a fault; if it is deliberate, it must be a syscall.
  - fault(unexpected, say I don't realize a bug in my code): there are many types of faults
    - Page fault: when the memory isn't mapped in the TLB. The kernel checks whether this is a valid memory address in the user program. If so, map the address into the TLB; if not, the kernel firstly checks whether the user program defines a page-fault signal handler (actually a segmentation-fault signal, named SIGSEG). It calls the handler if it is defined; if the handler is not defined, it terminates the user program.
    - Division by Zero: well mathematically this doesn't make sense... what should be done? Let the kernel handles it. The kernel firstly checks whether the user program defines a division-by-zero signal handler (actually a floating-point-error signal, named SIGFPE). If so, it calls that handler; if not, it terminates terminate the user program.
    - General Protection Fault (a user mode program executes a privileged instruction): kernel checks for handlers and the user program can be terminated if no handler is defined.
  - system call trap(expected, because we do made the syscall): user program calls instruction "TRAP" to switch the CPU to kernel mode and let the kernel handle the system call
- Interrupt(**async**, which means things happen regardless of the program run): two types: hardware interrupt and software interrupt
  - (hardware) interrupt(unexpected, you never know how long it takes a HDD/SSD to read files): timer, I/O signals (PS/2 keyboard/mouse pressed/moved, disk data ready to be read in the disk cache)
  - software interrupt(expected, well it is me who pressed Ctrl + C): SIGINT sent by a person, when the user program is executing

4. Your kernel should not have faults (e.g. division-by-zero), or you are screwed!!
No one is able to handle the kernel fault, so the kernel will "panic" (Windows: "blue screen"; Mac: 五国). The only way is to reboot.

5. What is the sequence of actions when the CPU detects an "event"?

a. CPU detects the event and switches itself from user mode to kernel mode (set the Mode bits to kernel mode in the status register)
b. CPU saves user process's states (PC register, SP register, General Purpose registers, etc....)
c. CPU calls the specific event handler. (by loading some address into PC. what address: according to the event type, load the address that corresponds to some jump/branch instruction in the exception vector table in the kernel)
d. The kernel performs certain actions, which are defined in the event handler
e. The kernel restores the user process's states
f. The kernel restores the Mode bits to user mode in the status register

6. Why some parts of the OS's event handling sequence is written in Assembly, rather than C?
Not all CPUs have identical architecture. Some has more registers. Some has registers specifically for passing (system call) arguments while some don't. Some have different addressing abilities (32-bit vs 64-bit CPU) and therefore have different memory mappings.

7. When a CPU doesn't support switching between kernel and user mode (only has one mode), is it still possible to implement an OS?
Yes! Actually most embed systems (e.g. QNX which runs in your car. if you have a car. ) only runs in kernel mode, even if the CPU supports both modes. In embed systems, the applications are known and will not have any malicious code (if the programmers/打工人s don't write any malicious code...). In this way there is no need for a boundary between the kernel space and user space, so we don't need kernel/user mode.

8. What is a stack? How does instructions "PUSH" and "POP" work?
Think about it... and check our previous notes. Basically PUSH pushes new value into the stack, and POP rewinds the stack pointer.

9. What exactly is a TRAP instruction? (What's the real Assembly code?)
Intel/AMD x86 (i386): **int 80h**
AMD/Intel x64 (x86_64, amd64): syscall
MIPS: **syscall**
ARM: swi SYSTEM_CALL_CODE

10. What are the benefits of an OS to the applcation programmers?
User program programmer do not need to worry about interference between different processes
An OS abstracts complex hardware into a set of clean interfaces (Think about writing a file. If I'm just writing a hello_world program, should I care about how I write into the file STDOUT? No! I call printf() and inside printf() a syscall write() will be called. The kernel actually writes to STDOUT. )

11. Data storage devices speeds (Fastest to Slowest):
Registers > CPU caches > RAM (main memory) > SSD(also has caches; the cache is faster than the flash memory itself) > HDD (also has caches; the caches are faster than the magnetic disk itself)

## Threads

<image-lost>
