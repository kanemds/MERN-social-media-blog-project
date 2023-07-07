const ROLES = {
  admin: 'Admin',
  employee: 'Employee',
  user: 'User'
}

const objectValues = Object.values(ROLES)
const objectKeys = Object.keys(ROLES)

console.log(objectValues) // [ 'Admin', 'Employee', 'User' ]
console.log(objectKeys) //  [ 'admin', 'employee', 'user' ]

const [roles, setRoles] = useState([])

const onRolesChanged = (e) => {
  const values = Array.from(
    e.target.selectedOptions,
    option => option.value
  )
  setRoles(values)
}

const options = objectValues.map(role => {
  return (
    <option
      key={role}
      value={role}
    >
      {role}
    </option>
  )
})

console.log(options)

  < label htmlFor = "roles" > Roles</label >

    <select name="rolse" id="roles" multiple={true} size='3' value={rolse} onChange={onRolesChanged}>
      {options}
    </select>