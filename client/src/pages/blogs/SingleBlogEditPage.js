import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDeleteBlogMutation, useGetSingleBlogQuery } from './blogsApiSlice'
import { Button, Container, Modal, Box, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import LoadingSpinner from '../../components/LoadingSpinner'
import SingleBlogEditForm from './SingleBlogEditForm'

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



const SingleBlogEditPage = () => {

  const { id, username } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState('')
  const [deleteReady, setDeleteReady] = useState(false)
  const [loadingSpin, setLoadingSpin] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState(null)

  const currentSingleBlog = {
    id: id ? id : '',
    username: username ? username : null
  }

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSingleBlogQuery(currentSingleBlog)

  const [
    deleteBlog,
    {
      data: message,
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      error: deleteError
    }
  ] = useDeleteBlogMutation()


  useEffect(() => {
    if (isSuccess) {
      setBlog(data)
    }
  }, [isSuccess, data])


  useEffect(() => {

    if (isDeleteLoading) {
      setLoadingSpin(true)
      setTimeout(() => {
        setDeleteReady(true)
      }, 1000)
    }

    if (isDeleteSuccess && deleteReady) {
      setLoadingSpin(false)
      setDeleteMessage(message?.message)
      setTimeout(() => {
        navigate('/blogs')
        setDeleteOpen(false)
        setDeleteReady(false)
      }, 1000)
    }
  }, [isDeleteSuccess, isDeleteLoading, deleteReady])


  const handleDeleteClose = () => setDeleteOpen(false)
  const handleDeleteConfirm = async (e) => {
    e.preventDefault()
    await deleteBlog({ id: blog._id })
  }

  let deleteModalMessage

  if (loadingSpin) {
    deleteModalMessage = <LoadingSpinner />
  }

  if (!isDeleteSuccess) {
    deleteModalMessage = (
      <>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Delete the selected blog?
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
          <Button variant='contained' onClick={handleDeleteClose}>Cancel</Button>
          <Button variant='contained' onClick={handleDeleteConfirm} sx={{
            backgroundColor: red[600],
            color: 'white',
            '&:hover': {
              backgroundColor: red[800]
            }
          }}>Delete Blog</Button>
        </Box>
      </>
    )
  }

  if (isDeleteSuccess && deleteReady && deleteMessage) {
    deleteModalMessage = (
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {deleteMessage}
      </Typography>
    )
  }

  let content

  if (isLoading) {
    content = (
      <Container sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </Container>
    )
  }


  if (blog && isSuccess) {
    content = <SingleBlogEditForm blog={blog} deleteBlog={deleteBlog} message={message} isDeleteSuccess={isDeleteSuccess} isDeleteLoading={isDeleteLoading} setDeleteOpen={setDeleteOpen} deleteOpen={deleteOpen} />
  }


  return (
    <>
      {content}
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
    </>
  )
}

export default SingleBlogEditPage