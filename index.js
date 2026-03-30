import express from 'express'
import router from './routes/index.route.js' // Import router dari file index.route.js

const app = express()
const port = 3000

app.use(express.json()) // Middleware untuk parsing JSON pada request body
app.use(router) // Gunakan router untuk menangani rute utama

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})