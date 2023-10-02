import moment from 'moment'
import { timeDisplayOptions } from '../config/timeDisplayOptions'

const useTimeDisplay = (time) => {

  let timeDisplay

  const current = Date.parse(new Date())
  const postedDay = Date.parse(time) // to millisecond
  const timeInMillisecond = current - postedDay
  const sevenDays = 7 * 24 * 60 * 60 * 1000 // Seven days in milliseconds

  if (timeInMillisecond <= sevenDays) {
    timeDisplay = moment(Date.parse(time)).fromNow()
  } else {
    timeDisplay = new Date(Date.parse(time)).toLocaleString(undefined, timeDisplayOptions.optionTwo)
  }

  return timeDisplay
}

export default useTimeDisplay