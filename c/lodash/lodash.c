#include <stdio.h>

void* identity(void* arg) {
    return arg;
}

int getAtIndex(int* array, int index) {
    if (array[0] == 2 && array[1] >= index + 1) {
        return array[index + 2];
    }
    else {
        return -1;
    }
}

int head(int* array) {
    if (array[0] == 2 && array[1] > 0) {
        return array[2];
    }
    else {
        return -1;
    }
}
