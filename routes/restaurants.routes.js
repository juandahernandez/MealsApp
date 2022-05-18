const express = require('express');

//middlewares
const { restaurantExists } = require('../middlewares/restaurants.middlewares');
const { reviewExists } = require('../middlewares/review.middlewares');
const {
  createRestaurantValidations,
  checkValidations
} = require('../middlewares/validations.middlewares');

const {
  protectToken,
  protectAccountOwner,
  userExists
} = require('../middlewares/users.middlewares');

// controllers
const {
  newRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createNewReview,
  updateReview,
  deleteReview
} = require('../controllers/restaurant.controller');

const router = express.Router();

router.get('/', getAllRestaurants);

router.get('/:id', restaurantExists, getRestaurantById);

router.use(protectToken);

router.post('/', createRestaurantValidations, checkValidations, newRestaurant);

router.patch('/:id', updateRestaurant);

router.delete('/:id', deleteRestaurant);

router.post('/reviews/:id', createNewReview);

router.patch(
  '/reviews/:id',
  reviewExists,
  userExists,
  protectAccountOwner,
  updateReview
);

router.delete(
  '/reviews/:id',
  reviewExists,
  userExists,
  protectAccountOwner,
  deleteReview
);

module.exports = { restaurantRouter: router };
