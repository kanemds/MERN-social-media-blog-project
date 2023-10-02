import React from 'react'

const useNumberDisplay = (number, decimalPlaces = 1) => {
  const abbreviateNumber = (number, decimalPlaces) => {
    if (number < 1000) {
      return number.toString()
    }

    const abbreviations = ['', 'k', 'M', 'B', 'T'] // You can extend this as needed

    // giving the correct index from the number provided: 1000 -> 1 k
    const abbreviationIndex = Math.floor(Math.log10(number) / 3)



    // cut number from 1000 to 1
    const abbreviatedNumber = (number / Math.pow(1000, abbreviationIndex))

    const filter = abbreviatedNumber.toString().split('', 3)

    let totalNumber
    if (filter[2] !== '0') totalNumber = parseFloat(filter.join(''))

    if (filter[2] === '0') totalNumber = parseFloat(filter[0])


    return totalNumber + abbreviations[abbreviationIndex]
  }

  const abbreviatedNumber = abbreviateNumber(number, decimalPlaces)

  return abbreviatedNumber
}



export default useNumberDisplay