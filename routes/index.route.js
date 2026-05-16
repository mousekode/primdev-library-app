// index.route.js

import express from 'express'
import booksRoute from './books.route.js'
import usersRoute from './users.route.js'
import profilesRoute from './profiles.route.js'
import categoriesRoute from './categories.route.js' // Import category route
import borrowingsRoute from './borrowings.route.js' // Import borrowing route

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the API Library')
})

router.use('/auth', authRoute)
router.use('/books', authenticateToken, booksRoute)
router.use('/users', authenticateToken, usersRoute)
router.use('/profiles', authenticateToken, profilesRoute)
router.use('/categories', authenticateToken, categoriesRoute)
router.use('/borrowings', authenticateToken, borrowingsRoute)

export default router