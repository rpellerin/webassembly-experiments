#include <stdio.h>
#include <time.h>
#include "prime.h"

int main(int argc, char ** argv) {
    time_t start, end;

    start = time(0);

    end = time(0);

    printf("in %f seconds.\n", difftime(end, start));
    return 0;
}
