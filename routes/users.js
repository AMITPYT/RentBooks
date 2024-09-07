const express = require('express');
const {
  getUsers,
  getUserById,
  addUser,
  updateUserById,
  deleteUserById
} = require('../controller/usersController');

const router = express.Router();

router.get('/get', getUsers);
router.get('/get/:id', getUserById);
router.post('/add', addUser);
router.put('/update/:id', updateUserById);
router.delete('/delete/:id', deleteUserById);

module.exports = router;
