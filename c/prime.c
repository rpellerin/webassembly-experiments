#include <stdio.h>
#include "prime.h"

unsigned int nbOfPrimesFound(unsigned int until) {
    unsigned int i, j, isPrime, counter = 1;
    for (i = 3; i <= until; i = i + 2) {
        isPrime = 1;
        for (j = 3; j <= i/2; j = j + 2) {
            if (i % j == 0) {
                isPrime = 0;
                break;
            }
        }

        if (isPrime == 1) {
            counter++;
        }
    }
    return counter;
}
