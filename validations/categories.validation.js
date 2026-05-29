import express from 'express'

import {
  createCategory,
  deleteCategory,
  getAllBooksByCategoryId,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/category.controller.js'

import { authorizeAdmin } from '../middlewares/admin.middleware.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/', getAllCategories)
router.get('/:id/books', getAllBooksByCategoryId)
router.get('/:id', getCategoryById)

router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  createCategory
)

router.put(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  updateCategory
)

router.delete(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  deleteCategory
)

export default router