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

router.use('/books', booksRoute)
router.use('/users', usersRoute)
router.use('/profiles', profilesRoute)
router.use('/categories', categoriesRoute) // Tambahkan category route
router.use('/borrowings', borrowingsRoute) // Tambahkan borrowing route

export default router