import { Modal, Box } from '@mui/material'
import React from 'react'

const ModalForDeleteBlog = ({ deleteOpen, handleDeleteClose, deleteModalMessage }) => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '330px',
    height: 140,
    bgcolor: 'background.paper',
    border: '2px solid #bdbdbd',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    p: 4,
    borderRadius: '20px',

  }

  return (
    <Modal
      open={deleteOpen}
      onClose={handleDeleteClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {deleteModalMessage}
      </Box>
    </Modal>

  )
}

export default ModalForDeleteBlog