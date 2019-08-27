module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("meetups", "user_id", {
      type: Sequelize.INTEGER,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn("meetups", "user_id");
  }
};
