#include <stdio.h>
#include <time.h>

int main(int argc, char ** argv) {
    time_t start, end;
    unsigned i, j, isPrime, counter = 1;

    start = time(0);

    for (i = 3; i <= 300000; i = i + 2) {
        isPrime = 1;
        for (j = 3; j <= i/2; j = j + 2) {
            if (i % j == 0) {
                isPrime = 0;
                break;
            }
        }

        if (isPrime == 1) {
            //printf("%d ", i);
            counter++;
        }
    }

    end = time(0);

    printf("\nCounter: %d, in %f seconds.\n", counter, difftime(end, start));
    return 0;
}
