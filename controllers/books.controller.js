import prisma from '../configs/database.config.js' // Import Prisma Client dari file database.js
import { isCategoryExist } from './categories.controller.js' // Import fungsi isCategoryExist dari categories.controller.js
import { validationResult } from 'express-validator';
import { getFileUrl, uploadFile } from './cloudinary.controller.js'

export const isBookExist = async (id) => {
  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id,
    },
  })

  return !!book
}

export const getBooks = async (req, res) => {
  // Mengambil semua buku dari database menggunakan Prisma Client
  const books = await prisma.books.findMany()

  // Tambahkan ini
  // add coverUrl to each book
  books.forEach((book) => {
    if (!book.cloudinaryId) {
      book.coverUrl = null
    } else {
	    book.coverUrl = getFileUrl(book.cloudinaryId)
    }
  })

  res.status(200).json({
    success: true,
    message: 'Books retrieved successfully',
    data: books,
  })
}

export const getBookById = async (req, res) => {
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
    return res.status(404).json({
      success: false,
      message: `Book with ID: ${id} not found`,
    })
  }

  // Tambahkan ini
  if (book.cloudinaryId) {
    book.coverUrl = getFileUrl(book.cloudinaryId)
  } else {
    book.coverUrl = null
  }


  res.status(200).json({
    success: true,
    message: 'Book retrieved successfully',
    data: book
  })
}

export const createBook = async (req, res) => {
  
  const validationErrors = validationResult(req)
  
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validationErrors.array(),
    })
  }
  
  // Mendapatkan data buku baru dari request body
  const { categoryId, title, author, year } = req.body
	// INI YANG BERUBAH
  const categoryExists = await isCategoryExist(categoryId)

  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: `Category with ID: ${categoryId} not found`,
    })
  }

  // Menambahkan buku baru ke database menggunakan Prisma Client
  const book = await prisma.books.create({
    data: {
      categoryId,
      title,
      author,
      year,
    },
  })

  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: book,
  })
}

export const updateBook = async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
const validationErrors = validationResult(req)

if (!validationErrors.isEmpty()) {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    errors: validationErrors.array(),
  })
}

  const id = parseInt(req.params.id)

  // Mendapatkan data buku yang akan diupdate dari request body
  const { categoryId, title, author, year } = req.body

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id,
    },
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.json({
      success: false,
      message: `Book with ID: ${id} not found`,
    })
  }

	// INI YANG BERUBAH
  const categoryExists = await isCategoryExist(categoryId)

  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: `Category with ID: ${categoryId} not found`,
    })
  }

  // tambahkan ini
  const cover = req.file
  let cloudinaryId = book.cloudinaryId

  // Jika ada file cover yang diunggah, unggah ke Cloudinary dan dapatkan public_id-nya
  if (cover) {
    // Jika buku sudah memiliki cover sebelumnya,
    // hapus file cover lama dari Cloudinary menggunakan public_id yang disimpan di database
    if (book.cloudinaryId) {
      const deleted = await deleteFile(book.cloudinaryId)
    }

    const result = await uploadFile(cover)
    cloudinaryId = result.public_id
  }

  // Mengupdate buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.update({
    where: {
      id: id,
    },
    data: {
      categoryId,
      title,
      author,
      year,
      cloudinaryId, // tambahkan ini
    },
  })


  res.status(200).json({
    success: true,
    message: 'Book updated successfully',
    data: book,
  })
}

export const deleteBook = async (req, res) => {
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
    return res.status(404).json({
      success: false,
      message: `Book with ID: ${id} not found`,
    })
  }

	// tambahkan ini
  // Jika buku memiliki cover yang diunggah ke Cloudinary, 
  // hapus file cover tersebut dari Cloudinary menggunakan public_id yang disimpan di database
  if (book.cloudinaryId) {
    const deleted = await deleteFile(book.cloudinaryId)
  }
  
  // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.delete({
    where: {
      id: id
    }
  })
  
  res.status(200).json({
    success: true,
    message: "Book deleted successfully"
  })
}