import React from 'react'
import { Link, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const LinkButton = ({ visit, name, style = 'contained', color = 'white', underline = 'none', fontSize = '1rem' }) => {
  return (
    <Button variant={style} sx={{ fontSize: { fontSize } }}>
      <Link to={visit} component={RouterLink} underline={underline} color={color}>
        {name}
      </Link>
    </Button>
  )
}

export default LinkButton