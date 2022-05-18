// Models
const { Order } = require('../models/order.model');

// Utils
const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.orderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id, status: 'active' }
  });

  if (!order) {
    return next(new AppError(404, 'Order does not exist with given Id'));
  }

  req.order = order;
  next();
});
