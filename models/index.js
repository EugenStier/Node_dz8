const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");
const Book = require("./book")(sequelize, Sequelize.DataTypes); // Импорт модели Book

module.exports = {
  Book,
  sequelize,
};
