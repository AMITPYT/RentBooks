const Book = require('../models/Book');

const getBooks = async (req, res) => {
  const { name, category, minRent, maxRent } = req.query;
  let query = {};
  
  if (name) {
    query.bookName = new RegExp(name, 'i');
  }
  
  if (category) {
    query.category = category;
  }

  if (minRent && maxRent) {
    query.rentPerDay = { $gte: parseInt(minRent), $lte: parseInt(maxRent) };
  }

  const books = await Book.find(query);
  res.json(books);
};

const getBookById = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book', error });
    }
  };

  const addBook = async (req, res) => {
    const { bookName, category, rentPerDay } = req.body;
    try {
      const newBook = new Book({ bookName, category, rentPerDay });
      await newBook.save();
      res.status(201).json(newBook);
    } catch (error) {
      res.status(500).json({ message: 'Error creating book', error });
    }
  };
 
  const updateBookById = async (req, res) => {
    try {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({ message: 'Error updating book', error });
    }
  };

  const deleteBookById = async (req, res) => {
    try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting book', error });
    }
  };
  
  module.exports = { getBooks, getBookById, addBook, updateBookById, deleteBookById };


