#include <stdio.h>
#include <time.h>
#include "prime.h"

int main(int argc, char *argv[]) {
    clock_t t0, t1;
    double diffms;
    unsigned int counter;

    t0 = clock();
    counter = nbOfPrimesFound(400000); // 400,000
    t1 = clock();
    diffms = (t1 - t0) / ( CLOCKS_PER_SEC / 1000 );

    printf("\nCounter: %d\n", counter);
    printf("in %f ms.\n", diffms);
    return 0;
}
