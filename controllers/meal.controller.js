//models
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

// util
const { filterObj } = require('../util/filterObj');
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');

exports.newMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { restaurant } = req;

  if (!name || !price) {
    return next(new AppError(400, 'insert valid data'));
  }

  const newMeal = await Meal.create({
    name,
    price,
    restaurantId: restaurant.id
  });

  res.status(201).json({
    status: 'succes',
    data: { newMeal }
  });
});

exports.getAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: { status: 'active' },
    include: [{ model: Restaurant }]
  });

  res.status(200).json({
    status: 'success',
    data: { meals }
  });
});

exports.getMealById = catchAsync(async (req, res, next) => {
  const { meal } = req;

  res.status(200).json({
    status: 'success',
    data: { meal }
  });
});

exports.updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  const data = filterObj(req.body, 'name', 'price');

  await meal.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});
