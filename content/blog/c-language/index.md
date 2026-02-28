---
title: "Day 1 - C Language Review"
date: "2020-02-06"
description: "A review of C language basics including for loops, nested for-loops, and string reversal."
tags: ["c", "programming", "review"]
---

Recommended time: 40 minutes.

## For Loop

Q: What is a for loop?
A: A for loop ...

1. Initializes some index
2. Checks if the condition is valid
3. If the condition is valid, do something
   If the condition is not valid, go below the for-loop

## Nested For-Loop

Q: What is a nested for-loop?
A: Well... Basically it is some for-loop inside another for-loop...

## Sample Question 1

Use nested for loops to print the following:

```
abcde
bcdea
cdeab
deabc
eabcd
```

**Try it yourself!**

## Sample Question 2

Given a string and its size in C Language, reverse the order of the characters.
e.g.
"abc" -> "cba"
"StudyHard123" -> "321draHydutS"

A function prototype is given as follows:

```c
#include <stdio.h>

void reverseString(char* s, int sSize){

}

int main(){
    char myString[128] = "StudyHard123";
    int mySSize = 12;
    reverseString(myString ,mySSize);
    printf("%s\n",myString);
    return 0;
}
```

**Try it yourself!**
