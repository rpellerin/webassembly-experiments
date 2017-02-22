/**
 * NOTICE OF LICENSE
 *
 * This source file is licensed exclusively to Inovia Team.
 *
 * @copyright   Copyright (c) 2017 Inovia Team (http://www.inovia.fr)
 * @license     MIT
 * @author      The Inovia Dev Team
 */

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
