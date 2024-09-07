const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

connectDB();

const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');

app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
