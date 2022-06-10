module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      id:{
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      username: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(120),
        allowNull: false
      },
      contentType: {
          type: Sequelize.STRING(45)
      },
      contentNumber: {
          type: Sequelize.INTEGER
      }
    }, {
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });
    return User;
  };