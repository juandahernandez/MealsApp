// models
const { Meal } = require('../models/meal.model');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');
const { User } = require('../models/user.model');

const initModels = () => {
  User.hasMany(Review);
  Review.belongsTo(User);

  User.hasMany(Order);
  Order.belongsTo(User);

  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);

  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  Order.hasOne(Meal, { foreignKey: 'restaurantId' });
  Meal.belongsTo(Order);
};

module.exports = { initModels };
