//models
const { Restaurant } = require('../models/restaurant.model');
const { Meal } = require('../models/meal.model');
const { Review } = require('../models/review.model');

// util
const { filterObj } = require('../util/filterObj');
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');

exports.newRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  if (!name || !address || !rating) {
    return next(new AppError(400, 'insert valid data'));
  }

  const newRestaurant = await Restaurant.create({
    name,
    address,
    rating
  });

  res.status(201).json({
    status: 'succes',
    data: { newRestaurant }
  });
});

exports.getAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: { status: 'active' },
    include: [
      { model: Meal, attributes: ['id', 'name', 'price', 'status'] },
      { model: Review, attributes: ['id', 'userId', 'comment', 'rating'] }
    ]
  });

  res.status(200).json({
    status: 'success',
    data: { restaurants }
  });
});

exports.getRestaurantById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
    include: [
      { model: Meal },
      { model: Review, attributes: ['id', 'userId', 'comment', 'rating'] }
    ]
  });

  if (!restaurant) {
    return next(new AppError(404, 'Restaurant does not exist with given Id'));
  }

  res.status(200).json({
    status: 'success',
    data: { restaurant }
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  const data = filterObj(req.body, 'name', 'address');

  await restaurant.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});

exports.createNewReview = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const { id } = req.params;

  const { comment, rating } = req.body;

  const newReview = await Review.create({
    userId: sessionUser.id,
    comment,
    restaurantId: id,
    rating
  });

  res.status(201).json({
    status: 'success',
    data: { newReview }
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  const data = filterObj(req.body, 'comment', 'rating');

  await review.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});
