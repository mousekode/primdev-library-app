import express from 'express'
import {
  createCategory,
  deleteCategory,
  getAllBooksByCategoryId, // import controller-nya
  getAllCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categories.controller.js'

const router = express.Router()

router.get('/', getAllCategories)
router.get('/:id/books', getAllBooksByCategoryId) // buat route baru
router.get('/:id', getCategoryById)
router.post('/', createCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router