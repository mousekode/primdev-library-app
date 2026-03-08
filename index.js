import express from 'express'
import { books } from './data.js' // Import data buku


const app = express()
const port = 3000

app.use(express.json()) // Middleware untuk parsing JSON pada request body

app.get('/', (req, res) => {
	res.send(books)
})

// GET buku berdasarkan ID
app.get('/books/:id', (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari buku dengan ID yang sesuai
  const book = books.find((book) => book.id === id)

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    res.send(`Book with ID: ${id} not found`)
  }

  res.send(book)
})

// POST untuk menambahkan buku baru
app.post('/books', (req, res) => {
  // Mendapatkan data buku baru dari request body
  const { title, author, year } = req.body

  // Membuat ID baru dengan menambahkan 1 pada ID terakhir di array books
  const newId = books.length + 1

  // Membuat objek buku baru dengan ID yang unik
  const newBook = { id: newId, title, author, year }

  // Menambahkan buku baru ke dalam array books
  books.push(newBook)

  res.send('Book created successfully')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})