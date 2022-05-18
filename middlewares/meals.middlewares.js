// Models
const { Meal } = require('../models/meal.model');

// Utils
const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.mealExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: { id, status: 'active' }
  });

  if (!meal) {
    return next(new AppError(404, 'Meal does not exist with given Id'));
  }

  req.meal = meal;
  next();
});
