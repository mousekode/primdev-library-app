import express from 'express'
// import prisma from './configs/database.js' dihapus karena sudah diimport di masing-masing controller
import {
  createBook,
  getBookById,
  getBooks,
  updateBook,
  deleteBook,
} from '../controllers/books.controller.js' // Import controller untuk buku

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', getBookById)
router.post('/', createBook)
router.put('/:id', updateBook)
router.delete('/:id', deleteBook)

export default router