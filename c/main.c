#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include "prime.h"

int main(int argc, char *argv[]) {
    clock_t t0, t1;
    double diffms;
    unsigned int nb, counter;

    // Do we have an argument? Otherwise use default value
    nb = argc > 1 ? atoi(argv[1]) : 400000;

    // Benchmark starts here
    t0 = clock();
    counter = nbOfPrimesFound(nb); // Actual tested function
    t1 = clock();
    // End of benchmark

    diffms = (t1 - t0) / ( CLOCKS_PER_SEC / 1000 ); // Run time calculation

    // Display results
    printf("Number of prime numbers between 2 and %d found: %d, in %f ms.", nb, counter, diffms);
    return 0;
}
