// Models
const { Restaurant } = require('../models/restaurant.model');

// Utils
const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.restaurantExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' }
  });

  if (!restaurant) {
    return next(new AppError(404, 'Restaurant does not exist with given Id'));
  }

  req.restaurant = restaurant;
  next();
});
