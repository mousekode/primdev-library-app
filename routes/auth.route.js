import express from 'express'
import { register, login } from '../controllers/auth.controller.js'
import { registerValidation, loginValidation } from '../validations/auth.validation.js'
import authRoute from './auth.route.js'

const router = express.Router()

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)
router.use('/auth', authRoute)