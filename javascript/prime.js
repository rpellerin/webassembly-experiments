const start = new Date();

var isPrime, i, j, counter = 1;

for (i = 3; i <= 300000; i = i + 2) {
    isPrime = true;

    for (j = 3; j <= i/2; j = j + 2) {
        if (i % j == 0) {
            isPrime = false;
            break;
        }
    }

    if (isPrime) {
        counter++;
    }
}

const end = new Date();
console.log("Counter: "+counter+", in "+ (end.getTime()-start.getTime())/1000 +" seconds.");
