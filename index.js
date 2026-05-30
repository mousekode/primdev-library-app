import express from 'express'
import router from './routes/index.route.js' // Import router dari file index.route.js
import logger from './configs/logger.config.js'

const app = express()
const port = 3000

app.use(express.json()) // Middleware untuk parsing JSON pada request body
app.use(router) // Gunakan router untuk menangani rute utama

if (process.env.ENV !== 'production') {
  const port = process.env.PORT || 3000

  app.listen(port, () => {
    logger.info(`Library API is running at http://localhost:${port}`)
    logger.info('Application started successfully')
  })
}

export default app