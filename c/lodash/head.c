#include <stdio.h>

void* head(void** array) {
    return array[0];
}

int main(int argc, char* argv[]) {
    void* array[3];

    char* one   = "one";
    char* two   = "two";
    char* three = "three";

    int i = 0;
    array[i++] = one;
    array[i++] = two;
    array[i++] = three;

    char* str = (char*) head(array);

    printf("%s\n", str);
    return 0;
}
