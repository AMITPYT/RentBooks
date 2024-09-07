const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');

const issueBook = async (req, res) => {
    const { bookName, userId, issueDate } = req.body;

    const book = await Book.findOne({ bookName });
    if (!book) return res.status(400).json({ message: 'Book not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const transaction = new Transaction({
        bookId: book._id,
        userId: user._id,
        issueDate: new Date(issueDate)
    });

    await transaction.save();
    res.json({ message: 'Book issued successfully', transaction });
};

const returnBook = async (req, res) => {
    const { bookName, userId, returnDate } = req.body;

    const book = await Book.findOne({ bookName });
    if (!book) return res.status(400).json({ message: 'Book not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const transaction = await Transaction.findOne({
        bookId: book._id,
        userId: user._id,
        returnDate: null
    });

    if (!transaction) return res.status(400).json({ message: 'No active transaction' });

    const daysRented = Math.ceil((new Date(returnDate) - transaction.issueDate) / (1000 * 60 * 60 * 24));
    const totalRent = daysRented * book.rentPerDay;

    transaction.returnDate = new Date(returnDate);
    transaction.totalRent = totalRent;

    await transaction.save();
    res.json({ message: 'Book returned', totalRent });
};

const getIssuedByBook = async (req, res) => {
    const { bookName } = req.params;

    try {
        const book = await Book.findOne({ bookName });
        if (!book) return res.status(400).json({ message: 'Book not found' });

        const transactions = await Transaction.find({ bookId: book._id });

        if (transactions.length === 0) {
            return res.json({ message: 'No transactions found for this book' });
        }

        const userPromises = transactions.map(async (transaction) => {
            const user = await User.findById(transaction.userId);
            return user ? { userId: user._id, name: user.name } : null;
        });

        const users = await Promise.all(userPromises);

        res.json({
            totalIssuedCount: transactions.length,
            issuedByUsers: users.filter(user => user !== null)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};

const getCurrentlyIssuedByBook = async (req, res) => {
    const { bookName } = req.params;

    try {
        const book = await Book.findOne({ bookName });
        if (!book) return res.status(400).json({ message: 'Book not found' });

        const transaction = await Transaction.findOne({
            bookId: book._id,
            returnDate: null
        });

        if (!transaction) {
            return res.json({ message: 'The book is not currently issued' });
        }

        const user = await User.findById(transaction.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            currentUser: {
                userId: user._id,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction', error });
    }
};

const getBooksIssuedByUser = async (req, res) => {
    const { userId, name } = req.params;

    try {
        let user;
        if (name) {
            user = await User.findOne({ name });
        }

        if (!user && userId) {
            user = await User.findById(userId);
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        const transactions = await Transaction.find({ userId: user._id });

        if (transactions.length === 0) {
            return res.json({ message: 'No books issued to this user' });
        }

        const bookPromises = transactions.map(async (transaction) => {
            const book = await Book.findById(transaction.bookId);
            return book ? { bookName: book.bookName, category: book.category } : null;
        });

        const books = await Promise.all(bookPromises);

        res.json({
            userId: user._id,
            name: user.name,
            booksIssued: books.filter(book => book !== null)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books issued by user', error });
    }
};

const getBooksIssuedInDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const transactions = await Transaction.find({
            issueDate: { $gte: start, $lte: end }
        });

        if (transactions.length === 0) {
            return res.json({ message: 'No books issued in this date range' });
        }

 
        const results = await Promise.all(transactions.map(async (transaction) => {
            const book = await Book.findById(transaction.bookId);
            const user = await User.findById(transaction.userId);

            return {
                bookName: book ? book.bookName : 'Unknown Book',
                userName: user ? user.name : 'Unknown User',
                issueDate: transaction.issueDate
            };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books issued in date range', error });
    }
};

module.exports = { issueBook, returnBook, getIssuedByBook, getCurrentlyIssuedByBook, getBooksIssuedByUser, getBooksIssuedInDateRange };
