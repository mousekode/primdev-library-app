import express from 'express'
import { users } from './data.js' // Import data buku
import { books } from './data.js'
import prisma from './database.js' // Import Prisma Client dari file database.js


const app = express()
const port = 3000

app.use(express.json()) // Middleware untuk parsing JSON pada request body

app.get('/', (req, res) => {
  res.send(users)
})

// Book CRUD

// Get semua buku
app.get('/books', async (req, res) => {
  // Mengambil semua buku dari database menggunakan Prisma Client
  const books = await prisma.books.findMany()
  
  res.send(books)
  
  res.json({
    "success": true,
    "message": "Books retrieved successfully",
    "data": books
  })
})

// Get buku berdasarkan ID
app.get('/books/:id', async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mengambil buku dengan ID yang sesuai dari database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
   if (!book) {
    return res.json({
      "success": false,
      "message": `Book with ID: ${id} not found`
    })
  }

  res.json({
    "success": true,
    "message": "Book retrieved successfully",
    "data": book
  })

  res.send(book)
})

// Menambahkan buku baru
app.post('/books', async (req, res) => {
  // Mendapatkan data buku baru dari request body
  const { title, author, year } = req.body

  // Menambahkan buku baru ke database menggunakan Prisma Client
  const book = await prisma.books.create({
    data: {
      title,
      author,
      year
    }
  })

  res.json({
    "success": true,
    "message": "Book created successfully",
    "data": book
  })

  res.send('Book created successfully')
})

// Update buku berdasarkan ID
app.put('/books/:id', async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mendapatkan data buku yang akan diupdate dari request body
  const { title, author, year } = req.body

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })
  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.json({
      "success": false,
      "message": `Book with ID: ${id} not found`
    })
  }
  
  // Mengupdate buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.update({
    where: {
      id: id
    },
    data: {
      title,
      author,
      year
    }
  })
  
  res.json({
    "success": true,
    "message": "Book updated successfully",
    "data": book
  })
})

// Menghapus buku berdasarkan ID
app.delete('/books/:id', async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.json({
      "success": false,
      "message": `Book with ID: ${id} not found`
    })
  }
  
  // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.delete({
    where: {
      id: id
    }
  })
  
  res.json({
    "success": true,
    "message": "Book deleted successfully"
  })
})

// User CRUD

// GET user berdasarkan ID
app.get('/user/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const user = users.find((user) => user.id === id)
  if (!user) {
    return res.json({
      "success": false,
      "message": `User with ID: ${id} not found`
    })
  }
  res.json({
    "success": true,
    "data": user
  })
})

// POST untuk menambahkan user baru
app.post('/user', (req, res) => {
  const { title, author, year } = req.body
  const newId = users.length + 1
  const newuser = { id: newId, title, author, year }
  users.push(newuser)
  res.json({
    "success": true,
    "message": "User created successfully",
    "data": newuser
  })
})

// PUT untuk mengupdate user berdasarkan ID
app.put('/user/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { title, author, year } = req.body
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) {
    return res.json({
      "success": false,
      "message": `User with ID: ${id} not found`
    })
  }
  users[userIndex] = {
    id: users[userIndex].id,
    title,
    author,
    year,
  }
  res.json({
    "success": true,
    "message": "User updated successfully",
    "data": users[userIndex]
  })
})

// DELETE untuk menghapus user berdasarkan ID
app.delete('/user/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) {
    res.send(`user with ID: ${id} not found`)
    return
  }
  users.splice(userIndex, 1)
  res.json({
    "success": true,
    "message": "User deleted successfully",
    "data": users[userIndex]
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})