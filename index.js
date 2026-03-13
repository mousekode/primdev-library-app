import express from 'express'
import { users } from './data.js' // Import data buku


const app = express()
const port = 3000

app.use(express.json()) // Middleware untuk parsing JSON pada request body

app.get('/', (req, res) => {
	res.send(users)
})

// GET buku berdasarkan ID
app.get('/user/:id', (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari buku dengan ID yang sesuai
  const user = users.find((user) => user.id === id)

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!user) {
    res.send(`user with ID: ${id} not found`)
  }

  res.send(user)
})

// POST untuk menambahkan buku baru
app.post('/user', (req, res) => {
  // Mendapatkan data buku baru dari request body
  const { title, author, year } = req.body

  // Membuat ID baru dengan menambahkan 1 pada ID terakhir di array users
  const newId = users.length + 1

  // Membuat objek buku baru dengan ID yang unik
  const newuser = { id: newId, title, author, year }

  // Menambahkan buku baru ke dalam array users
  users.push(newuser)

  res.send('user created successfully')
})

// PUT untuk mengupdate buku berdasarkan ID
app.put('/user/:id', (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mendapatkan data buku yang akan diupdate dari request body
  const { title, author, year } = req.body

  // Mencari buku dengan ID yang sesuai
  const userIndex = users.findIndex((user) => user.id === id)

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (userIndex === -1) {
    res.send(`user with ID: ${id} not found`)
    return
  }

  // Mengupdate data buku dengan menggunakan spread operator
  users[userIndex] = {
    id: users[userIndex].id,
    title,
    author,
    year,
  }

  res.send(`user with ID: ${id} updated successfully`)
})

// DELETE untuk menghapus buku berdasarkan ID
app.delete('/user/:id', (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari index buku dengan ID yang sesuai
  const userIndex = users.findIndex((user) => user.id === id)

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (userIndex === -1) {
    res.send(`user with ID: ${id} not found`)
    return
  }

  // Menghapus buku dari array menggunakan splice
  users.splice(userIndex, 1)

  res.send(`user with ID: ${id} deleted successfully`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})