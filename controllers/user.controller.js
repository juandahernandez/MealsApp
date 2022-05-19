const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// models
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

// util
const { filterObj } = require('../util/filterObj');
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');

exports.signupUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new AppError(400, 'insert valid data'));
  }

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role
  });
  newUser.password = undefined;

  res.status(201).json({
    status: 'succes',
    data: { newUser }
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: 'active' }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'Credentials are invalid'));
  }
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: { token, user }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const data = filterObj(req.body, 'name', 'email');

  await user.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: { userId: sessionUser.id },
    include: [{ model: Meal, include: [{ model: Restaurant }] }]
  });

  res.status(200).json({
    status: 'success',
    data: { orders }
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Order.findOne({
    where: { id, userId: sessionUser.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        model: Meal,
        attributes: ['id', 'name', 'price'],
        include: [{ model: Restaurant, attributes: ['id', 'name', 'address'] }]
      }
    ]
  });

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});
