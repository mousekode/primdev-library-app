import express from 'express'
import booksRoute from './books.route.js' // Import router untuk buku
import userRoute from './users.route.js' // Import router untuk user


const router = express.Router()

router.use(express.json()) // Middleware untuk parsing JSON pada request body

router.get('/', (req, res) => {
  res.send("Start searching.")
})

router.use('/books', booksRoute)
router.use('/users', userRoute)

export default router