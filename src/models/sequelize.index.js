const config = require("../config/db.config.js");
const fs = require('fs');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  port: config.port,
  operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);

//One-To-Many
db.role.hasMany(db.user, {
  foreignKey: { name: "role_id", allowNull: false, defaultValue: 1 },
});

//Many-To-Many
db.user.belongsToMany(db.user, {
  through: "user_follower",
  as: "user",
  foreignKey: "user_id",
  otherKey: "follower_id",
});
db.user.belongsToMany(db.user, {
  through: "user_follower",
  as: "follower",
  foreignKey: "follower_id",
  otherKey: "user_id",
});

db.ROLE = ["user", "admin", "moderator"];
module.exports = db;