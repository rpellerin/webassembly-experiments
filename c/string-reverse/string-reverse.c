#include <stdlib.h>
#include "string-reverse.h"

char* reverseString(char* str) {
    unsigned int length = 0; // strlen with #include <string.h>
    char* ptr = str;
    while(*(ptr++) != '\0') {
        length++;
    }

    char* output = (char*) malloc(length*sizeof(char));

    unsigned int i = 0;
    while(length--) {
            output[i++] = str[length];
    }
    return output;
}
