import express from 'express'
import {
    getAllBorrowings,
    getBorrowingById,
    createBorrowing,
    deleteBorrowing,
    returnBook,
} from '../controllers/borrowings.controller.js'

const router = express.Router()
router.get('/', getAllBorrowings)
router.get('/:id', getBorrowingById)
router.post('/', createBorrowing)
router.put('/:id/return', returnBook)
router.delete('/:id', deleteBorrowing)

export default router