const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../util/appError');

exports.createUserValidations = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

exports.createRestaurantValidations = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('address')
    .notEmpty()
    .withMessage('Address cannot be empty')
    .isString()
    .withMessage('Address must be a string'),
  body('rating')
    .isNumeric()
    .withMessage('Rating must be a number')
    .custom((value) => value > 0 && value <= 5)
    .withMessage('Rating must be between 1 and 5')
];

exports.createMealValidations = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .notEmpty()
    .withMessage('Price cannot be empty')
];

exports.checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    const errorMsg = messages.join('. ');

    return next(new AppError(400, errorMsg));
  }

  next();
};
