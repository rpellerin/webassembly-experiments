#include <stdlib.h>
#include <string.h>
#include "string-reverse.h"

char* reverseString(char* str) {
    unsigned int length = strlen(str);
    char* output = (char*) malloc(length*sizeof(char));

    unsigned int i = 0;
    while(length--) {
            output[i++] = str[length];
    }
    return output;
}
