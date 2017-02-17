#include <stdio.h>

void* identity(void* arg) {
    return arg;
}


int head(int* array) {
    return array[0];
}

int main(int argc, char* argv[]) {
    int array[3] = {1,2,3};

    int res = head(array);
    printf("%d\n", res);
    return 0;
}
