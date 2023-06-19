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

  res.status(200).json(notes)
})

// @desc Create a note
// route Post /notes
// @access Private
const createNote = asyncHandler(async (req, res) => { })

// @desc Update a note
// route Patch /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => { })

// @desc Delete a note
// route Delete /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => { })

module.exports = { getAllNotes, createNote, updateNote, deleteNote }