import express from 'express'

import {
  getBooks,
  getBookById,
  createBook,
  deleteBook,
  updateBook,
} from '../controllers/books.controller.js'

import { authorizeAdmin } from '../middlewares/admin.middleware.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

import {
  bookValidation,
  updateBookValidation,
} from '../validations/books.validation.js'

import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', getBookById)

router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  upload.single('cover'),
  bookValidation,
  createBook
)

router.put(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  upload.single('cover'),
  updateBookValidation,
  updateBook
)

router.delete(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  deleteBook
)

export default router