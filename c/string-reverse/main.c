#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "string-reverse.h"

int main(int argc, char *argv[]) {
    clock_t t0, t1;
    double diffms;

    char defaultString[] = "This is a test.";
    char* str;
    char* result;

    // Do we have an argument? Otherwise use default value
    if (1 < argc) {
        str = (char*) malloc(strlen(argv[1])*sizeof(char));
        strcpy(str, argv[1]);
    }
    else {
        str = (char*) malloc(strlen(defaultString)*sizeof(char));
        strcpy(str, defaultString);
    }

    //printf("Reversing '%s'\n\n", str);

    // Benchmark starts here
    t0 = clock();
    result = reverseString(str); // Actual tested function
    t1 = clock();
    // End of benchmark

    diffms = (t1 - t0) / ( CLOCKS_PER_SEC / 1000 ); // Run time calculation

    // Display results
    //printf("Reversed string: '%s'\n\nIn %f ms.\n", result, diffms);
    printf("%s\n", result);
    free(str);
    free(result);
    return 0;
}
