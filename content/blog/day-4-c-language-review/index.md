---
title: "Day 4 – C Language Review"
lang: "en"
author: "Junhao"
authorUrl: "https://junhao.ca"
sourceUrl: "https://junhao.ca/2021/10/28/day-4-c-language-review/"
publishedAt: "2021-10-28T05:44:46Z"
modifiedAt: "2022-11-04T04:11:43Z"
categories: ["C Review 30 days"]
date: "2021-10-28"
lastModified: "2022-11-04"
description: "C language exercises covering linked-list insertion, deletion, and hash-table operations."
tags: ["c", "programming", "tutorial"]
---

## Linked List

```c
#include <stdio.h>
#include <malloc.h>
#include <stdbool.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

void Node_push_head(Node **p_head, int num) {
    Node *new_guy = malloc(sizeof(Node));
    new_guy->next = *p_head;
    new_guy->data = num;

    *p_head = new_guy;
}

void Node_push_back(Node **p_head, int num) {
    while (*p_head != NULL) {
        p_head = &((*p_head)->next);
    }

    Node *new_guy = malloc(sizeof(Node));
    new_guy->next = NULL;
    new_guy->data = num;

    *p_head = new_guy;
}

int Node_pop_head(Node **p_head) {
    if (*p_head == NULL) {
        return -1;
    }

    Node *new_head = (*p_head)->next;
    int num = (*p_head)->data;
    free(*p_head);

    *p_head = new_head;

    return num;
}

int Node_pop_back(Node **p_head) {
    if (*p_head == NULL) {
        return -1;
    }

    while ((*p_head)->next != NULL) {
        p_head = &((*p_head)->next);
    }

    int num = (*p_head)->data;
    free(*p_head);

    *p_head = NULL;

    return num;
}

void Node_delete(Node **p_head, int target){
    if (*p_head == NULL) {
        return;
    }

    bool found = (*p_head)->data == target;

    while (!found && (*p_head)->next != NULL) {
        p_head = &((*p_head)->next);
        found = (*p_head)->data == target;
    }

    if (found){
        Node *new_head = (*p_head)->next;
        free(*p_head);
        (*p_head) = new_head;
    }
}


int main() {
    Node *head = NULL;

    int myNums[10] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
    for (int i = 0; i < 10; ++i) {
        Node_push_back(&head, myNums[i]);
    }

    for (int i = 0; i < 5; ++i) {
        printf("Pop head: data=%d\n", Node_pop_head(&head));
    }

    for (int i = 0; i < 5; ++i) {
        printf("Pop tail: data=%d\n", Node_pop_back(&head));
    }

    for (int i = 0; i < 5; ++i) {
        printf("Pop head: data=%d\n", Node_pop_head(&head));
    }

    for (int i = 0; i < 5; ++i) {
        printf("Pop tail: data=%d\n", Node_pop_back(&head));
    }

    for (int i = 2; i < 2 + 5; ++i) {
        Node_push_back(&head, myNums[i]);
    }

    for (int i = 0; i < 5; ++i) {
        printf("Pop tail: data=%d\n", Node_pop_back(&head));
    }

    for (int i = 3; i < 3 + 5; ++i) {
        Node_push_head(&head, myNums[i]);
    }

    Node_delete(&head, 6);

    for (int i = 0; i < 5; ++i) {
        printf("Pop tail: data=%d\n", Node_pop_back(&head));
    }


    return 0;
}
```

## Hash Table

1. Implement the following functions:

   ```c
   void insert(int num);  // insert a num into the hash table
   int delete(int index);  // return the deleted "num"
   ```

2. Use the functions above to implement this function:

   ```c
   int insertAndEvictWhenNeeded(int num); // insert a num and return the evicted value when the hash table is full
   ```
