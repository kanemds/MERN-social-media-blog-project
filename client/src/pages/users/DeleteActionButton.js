import React, { useEffect, useState } from 'react'
import { Box, Button, Fab, Modal } from '@mui/material'
import { red } from '@mui/material/colors'
import { useDeleteUserMutation } from './UserApiSlice'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useLocation } from 'react-router-dom'
import ClearIcon from '@mui/icons-material/Clear'

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,

  bgcolor: 'background.paper',
  border: '2px solid #bdbdbd',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '20px',
}

const DeleteActionButton = ({ userId }) => {

  const location = useLocation()

  const isDashUsers = location.pathname === '/dash/users'


  const navigate = useNavigate()
  const [open, setOpen] = useState(false)


  const [
    deleteUser, {
      isSuccess,
      isLoading,
      isError,
      error
    }
  ] = useDeleteUserMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await deleteUser({ id: userId })
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  useEffect(() => {
    if (isSuccess) {
      setOpen(false)
      navigate('/')
    }
  }, [isSuccess])


  return (
    <Box
      sx={{ m: 1, position: 'relative' }}
    >
      <Fab
        sx={{
          backgroundColor: red[600],
          color: 'white',
          '&:hover': {
            color: red[600]
          },
          width: isDashUsers ? 40 : 36,
          height: isDashUsers ? 40 : 36,
        }}
        onClick={handleOpen}
      >
        {isDashUsers ? <DeleteForeverIcon sx={{ fontSize: 35 }} /> : <ClearIcon sx={{ fontSize: 20 }} />}


      </Fab >

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >

        <Box sx={style}>
          {isLoading ? <LoadingSpinner /> :
            isError ? <Typography id="modal-modal-description" sx={{ m: 2 }}>
              {error?.data.message}
            </Typography> :
              <>
                <Typography id="modal-modal-description" sx={{ m: 2 }}>
                  Delete the selected user?
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2, width: '100%' }}>
                  <Button variant='contained' onClick={handleClose}>Cancel</Button>
                  <Button variant='contained'
                    sx={{
                      backgroundColor: red[600],
                      color: 'white',
                      '&:hover': {
                        backgroundColor: red[800]
                      }
                    }}
                    onClick={handleSubmit}
                  >
                    Delete User
                  </Button>


                </Box>
              </>
          }
        </Box>

      </Modal>

    </Box >
  )
}

export default DeleteActionButton