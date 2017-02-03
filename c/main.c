#include <stdio.h>
#include <time.h>
#include "prime.h"

int main(int argc, char *argv[]) {
    time_t start, end;
    unsigned int counter;

    start = time(0);
    counter = nbOfPrimesFound(300000); // 300,000
    end = time(0);

    printf("\nCounter: %d\n", counter);
    printf("in %f seconds.\n", difftime(end, start));
    return 0;
}
