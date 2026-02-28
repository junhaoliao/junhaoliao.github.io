---
title: "Day 2 - C Language Review"
date: "2020-02-06"
description: "A review of C language pointers, strings, and a palindrome-checking exercise as part of a 30-day C review series."
tags: ["c", "programming", "tutorial"]
---

Recommended time: 30 minutes

## Pointer

A pointer is a variable which stores some address. The address can be a memory address, which maps to other variables or codes. In the second year, you will know that pointer can also store hardware addresses, which aids software and hardware interaction.

Dereferencing operator(*):

```c
int b = 0;
int* a = &b;
*a = 666;
// Since "a" stores the address of variable "b",
// dereferencing "a" and modify the value actually modifies "b"
// Therefore
printf("%d\n",b); // prints b, which is "666"
printf("%d\n",a); // prints a, which is the address of "b"
printf("%d\n",*a); // prints b, because (the address stored in a) is (b's address)
```

## Strings

There are basically 2 ways to declare a string in C.

1. Using an Array

```c
char myStringArr[256] = "Hello World!";
```

2. Using a char-type pointer

```c
char * myStringPtr = (char*) malloc(sizeof(char)*256);
strcpy(myStringPtr,"Hello World!");
```

There is 1 common way to print a string

```c
// As you may have known, both "myStringArr" and "myStringPtr" are pointers.
// You must always pass a pointer to printf() whenever you want to print a string
// Note: "myStringArr" points to the first element of the "myStringArr[256]" array

printf("%s\n",myStringArr);
// or
printf("%s\n",myStringPtr);
```

## Sample Question 1

As you probably know, the reverse of "20200202" is itself. This kind of strings is called "palindrome".
Write a Boolean-type function to check whether a string is palindrome.

A function prototype is given as follows:

```c
#include <stdio.h>
#include <stdbool.h>

// returns "true" if the given string is a palindrome.
bool isPalindrome(char* s, int sSize){

}

int main() {
    char myString[128] = "20200202";
    int mySSize = 8;
    bool result = isPalindrome(myString,mySSize);
    printf("Your function is %s\n", result?"Correct":"Wrong");
    return 0;
}
```

**Try it yourself!**
