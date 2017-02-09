function plain_nbOfPrimesFound (nb) {
  var isPrime, i, j, counter = 1

  for (i = 3; i <= nb; i = i + 2) {
    isPrime = true

    for (j = 3; j <= i / 2; j = j + 2) {
      if (i % j === 0) {
        isPrime = false
        break
      }
    }

    if (isPrime) {
      counter++
    }
  }
  return counter
}
