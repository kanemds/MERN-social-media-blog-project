const userInputs = {
  username: {
    placeholder: 'Username',
    text: 'Please enter a username with at least 4 characters',
    error: 'Please enter a valid username',
    correct: '',
    type: 'text'
  },
  email: {
    placeholder: 'Email',
    text: 'Please enter a valid email',
    error: 'Invalid email, please try again',
    correct: '',
    type: 'email'
  },
  password: {
    placeholder: 'Password',
    text: 'Password must be at least 8 characters, and contain both letters and numbers.',
    error: 'Invalid password, please include at least one capital character and one number',
    correct: '',
    type: 'password'
  },
  newPassword: {
    placeholder: 'New Password',
    text: 'Password must be at least 8 characters, and contain both letters and numbers.',
    error: 'Invalid password, please include at least one capital character and one number',
    correct: '',
    type: 'password'
  },
  confirm: {
    placeholder: 'Confirm Password',
    text: 'Please enter your password again',
    error: 'Please match with your password',
    correct: '',
    type: 'password'
  },
}

export default userInputs