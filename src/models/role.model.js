module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
      },
    }, {
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });

    return Role;
  };