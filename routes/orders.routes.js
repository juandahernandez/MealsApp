const express = require('express');

//middlewares
const { orderExists } = require('../middlewares/order.middleware');
const { mealExists } = require('../middlewares/meals.middlewares');
const {
  protectToken,
  protectAccountOwner,
  userExists
} = require('../middlewares/users.middlewares');

// controllers
const {
  newOrder,
  getAllOrders,
  updateOrder,
  deleteOrder
} = require('../controllers/order.controller');

const router = express.Router();

router.use(protectToken);

router.post('/', newOrder);

router.get('/me', getAllOrders);

router.patch('/:id', orderExists, userExists, protectAccountOwner, updateOrder);

router.delete(
  '/:id',
  orderExists,
  userExists,
  protectAccountOwner,
  deleteOrder
);

module.exports = { orderRouter: router };
