#include "prime.h"

/**
 * Simple function slightly optimized that calculates
 * the number of prime number between 2 and until
 **/
unsigned int nbOfPrimesFound(unsigned int until) {
    unsigned int i, j, isPrime, counter = 1;
    // counter starts at 1 because 2 is a prime number,
    // and we skip it

    for (i = 3; i <= until; i = i + 2) { // Skip even numbers
        isPrime = 1;
        for (j = 3; j <= i/2; j = j + 2) { // Skip even numbers
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
