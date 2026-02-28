---
title: "C++ Implementation to ECE345 HW2 Q1"
date: "2019-10-02"
description: "A C++ implementation for ECE345 Homework 2 Question 1, featuring merge sort and a binary search-based algorithm to find if two elements in a sorted array form a given product."
tags: ["ece345", "c++", "algorithms", "sorting"]
---

No plagiarism involved since this part is not marked anyways, and the announcement was sent right after I finished the code.

```cpp
#include <iostream>
#include <vector>

std::vector<unsigned> testArray = {7,4,2,3,5};

unsigned testNum = 28;

void merge (std::vector<unsigned> &array, unsigned l, unsigned m, unsigned r){
    unsigned lSize = m-l+1;
    unsigned rSize = r-m;

   unsigned leftArray [lSize];
   unsigned rightArray [rSize];

   for(unsigned i=0;i<lSize;i++){
      leftArray[i] = array[l+i];
   }

   for(unsigned j=0;j<rSize;j++){
      rightArray[j] = array[m+1+j];
   }

   unsigned i = 0;
   unsigned j = 0;
   unsigned k = l;

   while(i<lSize && j<rSize){
      if(leftArray[i]<rightArray[j]){
         array[k] = leftArray[i];
         i++;
      } else{
         array[k] = rightArray[j];
         j++;
      }
      k++;
   }
   while(i<lSize){
      array[k] = leftArray[i];
      i++;
      k++;
   }
   while(j<rSize){
      array[k] = rightArray[j];
      j++;
      k++;
   }
}

void mergeSort (std::vector<unsigned> &array, int l, int r){
   if(l<r){
      int m  = (l+r)/2;

      mergeSort(array,l,m);
      mergeSort(array,m+1,r);

      merge(array,l,m,r);
   }

}

void printArray(const std::vector<unsigned> &array){
    std::cout<<"{";
    size_t arraySize = array.size();
    for(unsigned i=0;i<arraySize;i++){
        std::cout<<array[i]<<",";
    }
    std::cout<<"}"<<std::endl;
}

bool findIfFormProduct(const std::vector<unsigned>& array, unsigned num){

    unsigned arraySize = array.size();

    int r = arraySize - 1;
    for(unsigned i = 0; i<arraySize;i++){
        int l = i;
        int m = (l+r)/2;
        while(l<=r){
            int product = array[i]*array[m];
            if(product==num){
                return true;
            } else if(product<num){ // search right
                l = m + 1;
            } else{ // search left
                r = m - 1;
            }
            m = (l+r)/2;
        }
    }
    return false;
}

int main() {
    std::cout<<"The array before sorting is ";
    printArray(testArray);
    mergeSort(testArray,0,testArray.size()-1);

    std::cout<<"The array after sorting is ";
    printArray(testArray);

    std::cout<<"The result is "<<(findIfFormProduct(testArray,testNum)?1:0)<<std::endl;
    return 0;
}
```
