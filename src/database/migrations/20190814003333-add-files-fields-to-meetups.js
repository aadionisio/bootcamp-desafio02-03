module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("meetups", "file_id", {
      type: Sequelize.INTEGER,
      references: { model: "files", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn("meetups", "file_id");
  }
};
