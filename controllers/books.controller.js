import prisma from '../configs/database.config.js'
import logger from '../configs/logger.config.js'
import { getFileUrl } from './cloudinary.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { validationResult, matchedData } from 'express-validator'
import {
  uploadFile,
  deleteFile,
} from './cloudinary.controller.js'

export const getBooks = async (req, res) => {
  const { includeCategory } = req.query

  const books = await prisma.books.findMany({
    include: includeCategory === 'true'
      ? {
          category: true
        }
      : undefined
  }) 

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
  try {
    const id = parseInt(req.params.id)
    logger.debug({ booksId: id }, 'getBookById: Started')

    const books = await prisma.books.findUnique({
      where: {
        id: id,
      },
    })

    if (!books) {
      logger.warn({ booksId: id }, 'books not found')
      return res.status(404).json({
        success: false,
        message: `books with ID: ${id} not found`,
      })
    }

    if (books.cloudinaryId) {
      books.coverUrl = getFileUrl(books.cloudinaryId)
    } else {
      books.coverUrl = null
    }
    logger.info({ booksId: id }, 'books retrieved successfully')

    res.status(200).json({
      success: true,
      message: 'books retrieved successfully',
      data: books,
    })
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to retrieve books')
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving books',
      error: error.message,
    })
  }
}

export const createBook = async (req, res) => {
  try {
    logger.debug({ body: req.body }, 'createBook: Started')

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn({ errors: validationErrors.array() }, 'Validation failed')
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors.array(),
      })
    }

    // Mendapatkan data buku baru dari request body
    const { categoryId, title, author, year } = req.body

    // Mengecek apakah kategori dengan ID yang diberikan ada di database menggunakan fungsi isCategoryExist
    logger.debug({ categoryId }, 'Checking if category exists')
    const categoryExists = await isCategoryExist(categoryId)

    if (!categoryExists) {
      logger.warn({ categoryId }, 'Category not found')
      return res.status(404).json({
        success: false,
        message: `Category with ID: ${categoryId} not found`,
      })
    }

    const cover = req.file
    let cloudinaryId = null

    if (cover) {
      logger.debug(
        { fileName: cover.filename },
        'Uploading cover to Cloudinary',
      )
      const result = await uploadFile(cover)
      cloudinaryId = result.public_id
      logger.info({ cloudinaryId }, 'Cover uploaded successfully')
    }

    logger.debug(
      { title, author, year, categoryId },
      'Creating books in database',
    )
    const books = await prisma.books.create({
      data: {
        categoryId,
        title,
        author,
        year,
        cloudinaryId,
      },
    })

    logger.info({ booksId: books.id, title }, 'books created successfully')
    res.status(201).json({
      success: true,
      message: 'books created successfully',
      data: books,
    })
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to create books')
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating books',
      error: error.message,
    })
  }
}

export const updateBook = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    logger.debug({ booksId: id, body: req.body }, 'updatebooks: Started')

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn(
        { booksId: id, errors: validationErrors.array() },
        'Validation failed',
      )
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors.array(),
      })
    }

    const { categoryId, title, author, year } = req.body
    
    logger.debug({ booksId: id }, 'Finding books in database')
    const books = await prisma.books.findUnique({
      where: {
        id: id,
      },
    })

    if (!books) {
      logger.warn({ booksId: id }, 'books not found')
      return res.status(404).json({
        success: false,
        message: `books with ID: ${id} not found`,
      })
    }

    if (categoryId) {
      logger.debug({ categoryId }, 'Checking if category exists')
      const categoryExists = await isCategoryExist(categoryId)

      if (!categoryExists) {
        logger.warn({ booksId: id, categoryId }, 'Category not found')
        return res.status(404).json({
          success: false,
          message: `Category with ID: ${categoryId} not found`,
        })
      }
    }

    const cover = req.file
    let cloudinaryId = books.cloudinaryId

    if (cover) {
      if (books.cloudinaryId) {
        logger.debug(
          { booksId: id, oldCloudinaryId: books.cloudinaryId },
          'Deleting old cover',
        )
        await deleteFile(books.cloudinaryId)
      }

      logger.debug(
        { booksId: id, fileName: cover.filename },
        'Uploading new cover to Cloudinary',
      )
      const result = await uploadFile(cover)
      cloudinaryId = result.public_id
      logger.info({ booksId: id, cloudinaryId }, 'Cover uploaded successfully')
    }

    logger.debug(
      { booksId: id, updates: { title, author, year, categoryId } },
      'Updating books',
    )
    await prisma.books.update({
      where: {
        id: id,
      },
      data: {
        categoryId,
        title,
        author,
        year,
        cloudinaryId,
      },
    })

    logger.info({ booksId: id, title }, 'books updated successfully')
    res.status(200).json({
      success: true,
      message: 'books updated successfully',
      data: books,
    })
  } catch (error) {
    logger.error(
      { booksId: req.params.id, error: error.message },
      'Failed to update books',
    )
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating books',
      error: error.message,
    })
  }
}

export const deleteBook = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    logger.debug({ booksId: id }, 'deleteBook: Started')

    logger.debug({ booksId: id }, 'Finding books in database')
    const books = await prisma.books.findUnique({
      where: {
        id: id,
      },
    })

    if (!books) {
      logger.warn({ booksId: id }, 'books not found')
      return res.status(404).json({
        success: false,
        message: `books with ID: ${id} not found`,
      })
    }

    if (books.cloudinaryId) {
      logger.debug(
        { booksId: id, cloudinaryId: books.cloudinaryId },
        'Deleting cover from Cloudinary',
      )
      await deleteFile(books.cloudinaryId)
    }

    logger.debug({ booksId: id }, 'Deleting books from database')
    await prisma.books.delete({
      where: {
        id: id,
      },
    })

    logger.info({ booksId: id }, 'books deleted successfully')
    res.status(200).json({
      success: true,
      message: 'books deleted successfully',
    })
  } catch (error) {
    logger.error(
      { booksId: req.params.id, error: error.message },
      'Failed to delete books',
    )
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting books',
      error: error.message,
    })
  }
}

export const isbooksExist = async (id) => {
  const books = await prisma.books.findUnique({
    where: {
      id: id,
    },
  })

  return !!books
}

export const isCategoryExist = async (id) => {
  const category = await prisma.categories.findUnique({
    where: {
      id: parseInt(id),
    },
  })

  return !!category
}