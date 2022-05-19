const express = require('express');

//middlewares
const { mealExists } = require('../middlewares/meals.middlewares');

const { restaurantExists } = require('../middlewares/restaurants.middlewares');

const {
  createMealValidations,
  checkValidations
} = require('../middlewares/validations.middlewares');

const {
  protectToken,
  protectAccountOwner,
  userExists
} = require('../middlewares/users.middlewares');

// controllers
const {
  newMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal
} = require('../controllers/meal.controller');


const router = express.Router();

router.get('/', getAllMeals);

router.get('/:id', mealExists, getMealById);

router.use(protectToken);

router.post(
  '/:id',
  createMealValidations,
  checkValidations,
  restaurantExists,
  newMeal
);

router.patch('/.id', mealExists, userExists, protectAccountOwner, updateMeal);

router.delete('/:id', mealExists, userExists, protectAccountOwner, deleteMeal);

module.exports = { mealRouter: router };
