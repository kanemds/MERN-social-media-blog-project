const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')

// @desc Get all notes
// route Get /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean()

  if (!notes?.length) {
    return res.status(404).json({ message: 'No notes found' })
  }

  // handle multiple promises concurrently and wait for all of them to resolve
  const notesWithUsers = await Promise.all(notes.map(async note => {
    const noteUser = await User.findById(note.user).lean().exec()
    return { ...note, user: noteUser.username }
  }))

  res.status(200).json(notesWithUsers)
})

// @desc Create a note
// route Post /notes
// @access Private
const createNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body

  if (!user || !title || !text) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const titleExist = await Note.findOne({ title }).lean().exec()

  if (titleExist) {
    return res.status(400).json({ message: 'Title has been used' })
  }

  const newNote = await Note.create({ user, title, text })

  // res.status(201).json({ message: 'New note created' })
  if (newNote) {
    return res.status(201).json({ message: 'New note created' })
  } else {
    return res.status(400).json({ message: 'Invalid note data received' })
  }
})

// @desc Update a note
// route Patch /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {

  const { id, user, title, text, completed } = req.body

  if (!id || !user || !title || !text || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const note = await Note.findById(id).exec()
  console.log(note)

  if (!note) {
    return res.status(400).json({ message: 'Note not found' })
  }

  const titleExist = await Note.findOne({ title }).lean().exec()

  if (titleExist && titleExist._id.toString() !== id) {
    return res.status(409).json({ message: 'Title has been used' })
  }

  note.user = user
  note.title = title
  note.text = text

  const updatedNote = await note.save()

  res.json(`${updatedNote.title} updated`)
})

// @desc Delete a note
// route Delete /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'Note ID required' })
  }

  // Confirm note exists to delete 
  const note = await Note.findById(id).exec()

  if (!note) {
    return res.status(400).json({ message: 'Note not found' })
  }

  const result = await note.deleteOne()

  const reply = `Note '${result.title}' with ID ${result._id} deleted`

  res.json(reply)


})

module.exports = { getAllNotes, createNote, updateNote, deleteNote }