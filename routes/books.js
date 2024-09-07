const express = require('express');
const {
  getBooks,
  getBookById,
  addBook,
  updateBookById,
  deleteBookById
} = require('../controller/booksController');

const router = express.Router();

router.get('/search', getBooks);
router.get('/get/:id', getBookById);
router.post('/add', addBook);
router.put('/update/id', updateBookById);
router.delete('/delete/:id', deleteBookById);

module.exports = router;
