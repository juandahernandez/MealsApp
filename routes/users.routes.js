const express = require('express');

// middlewares
const {
  userExists,
  protectToken
} = require('../middlewares/users.middlewares');

const {
  createUserValidations,
  checkValidations
} = require('../middlewares/validations.middlewares');

// controllers
const {
  signupUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllOrders,
  getOrderById
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/signup', createUserValidations, checkValidations, signupUser);

router.post('/login', loginUser);

router.use(protectToken);

router.get('/orders', getAllOrders);

router.get('/orders/:id', getOrderById);

router
  .route('/:id')
  .patch(userExists, updateUser)
  .delete(userExists, deleteUser);

module.exports = { usersRouter: router };
