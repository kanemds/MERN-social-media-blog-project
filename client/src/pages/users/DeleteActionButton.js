import React, { useEffect, useState } from 'react'
import { Box, Button, Fab, Modal } from '@mui/material'
import { red } from '@mui/material/colors'
import { useDeleteUserMutation } from './UserApiSlice'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import LoadingSpinner from '../../components/LoadingSpinner'


const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 230,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const DeleteActionButton = ({ userId }) => {



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
      navigate('/dash/users')
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
          width: 40,
          height: 40,
        }}
        onClick={handleOpen}
      >
        <DeleteForeverIcon sx={{ fontSize: 35 }} />
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
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Delete user:{userId}
              </Typography>
              <Typography id="modal-modal-description" sx={{ m: 2 }}>
                Select "Yes" to delete or "No" back to Previous page
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 3, width: '100%' }}>
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
                  Yes
                </Button>

                <Button variant='contained' onClick={handleClose}>No</Button>
              </Box>
            </>
          }
        </Box>

      </Modal>

    </Box >
  )
}

export default DeleteActionButton