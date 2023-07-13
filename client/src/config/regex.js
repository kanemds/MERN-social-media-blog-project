const USER_REGEX = /^[A-z]{4,}$/

// const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
const PASSWORD_REGEX = /^(?=.*\d)[a-zA-Z\d]{8,}$/

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

export {
  USER_REGEX,
  PASSWORD_REGEX,
  EMAIL_REGEX
}