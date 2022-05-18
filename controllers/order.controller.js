//models
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');
//const { User } = require('../models/user.model');
const { Meal } = require('../models/meal.model');

// util
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');

exports.newOrder = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const { meal } = req;
  const { sessionUser } = req;

  if (!quantity) {
    return next(new AppError(400, 'insert valid data'));
  }

  if (!meal) {
    return next(new AppError(400, 'meal not exist'));
  }

  const totalPrice = meal.price * quantity;

  const newOrder = await Order.create({
    mealId: meal.id,
    userId: sessionUser.id,
    totalPrice: totalPrice,
    quantity
  });

  res.status(201).json({
    status: 'succes',
    data: { newOrder }
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: { userId: sessionUser.id },
    include: [
      { model: Meal, include: [{ model: Restaurant }] }
      // { model: User, attributes: ['id', 'name'] }
    ]
  });

  res.status(200).json({
    status: 'success',
    data: { orders }
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'completed' });

  res.status(204).json({ status: 'success' });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});
