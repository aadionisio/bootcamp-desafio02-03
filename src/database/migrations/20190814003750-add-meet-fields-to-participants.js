module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("participants", "meetup_id", {
      type: Sequelize.INTEGER,
      references: { model: "meetups", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn("participants", "meetup_id");
  }
};
