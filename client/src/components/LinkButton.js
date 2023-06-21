import React from 'react'
import { Link, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const LinkButton = ({ visit, name, style = 'contained', color = 'white', underline = 'none' }) => {
  return (
    <Button variant={style}>
      <Link to={visit} component={RouterLink} underline={underline} color={color}>
        {name}
      </Link>
    </Button>
  )
}

export default LinkButton