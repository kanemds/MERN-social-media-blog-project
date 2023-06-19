const router = require('express').Router()
const { getAllNotes, updateNote, createNote, deleteNote } = require('../controllers/notesController')

router.route('/')
  .get(getAllNotes)
  .post(updateNote)
  .patch(createNote)
  .delete(deleteNote)

module.exports = router