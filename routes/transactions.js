const express = require('express');
const { issueBook, returnBook, getIssuedByBook, getCurrentlyIssuedByBook, getBooksIssuedByUser, getBooksIssuedInDateRange } = require('../controller/transactionsController');

const router = express.Router();

router.post('/issue', issueBook);
router.post('/return', returnBook);
router.get('/issuedByBook/:bookName', getIssuedByBook);
router.get('/currentlyIssued/:bookName', getCurrentlyIssuedByBook);
router.get('/issuedByUser/:userId?', getBooksIssuedByUser);
router.get('/issuedInDateRange', getBooksIssuedInDateRange);

module.exports = router;
