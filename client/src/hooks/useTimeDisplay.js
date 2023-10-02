import moment from 'moment'
import { timeDisplayOptions } from '../config/timeDisplayOptions'

const useTimeDisplay = (createdAt) => {
  const current = Date.parse(new Date())
  const postedDay = Date.parse(createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7


  const timeInMillisecond = current - postedDay

  let timeDisplay

  if (timeInMillisecond <= sevenDays) {
    timeDisplay = moment(Date.parse(createdAt)).fromNow()
  } else {
    timeDisplay = new Date(Date.parse(createdAt)).toLocaleString(undefined, timeDisplayOptions.optionTwo)
  }

  return timeDisplay
}

export default useTimeDisplay