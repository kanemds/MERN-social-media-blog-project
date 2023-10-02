import React from 'react'

const useLikeCount = (number, decimalPlaces = 1) => {
  function abbreviateNumber(number, decimalPlaces) {
    if (number < 1000) {
      return number.toString()
    }
    const abbreviations = ['', 'k', 'M', 'B', 'T'] // You can extend this as needed
    const abbreviationIndex = Math.floor(Math.log10(number) / 3)
    const abbreviatedNumber = (number / Math.pow(1000, abbreviationIndex)).toFixed(decimalPlaces)
    return abbreviatedNumber + abbreviations[abbreviationIndex]
  }

  const abbreviatedNumber = abbreviateNumber(number, decimalPlaces)

  return abbreviatedNumber
}

export default useLikeCount