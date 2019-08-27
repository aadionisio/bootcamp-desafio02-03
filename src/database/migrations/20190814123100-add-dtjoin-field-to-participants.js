module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("participants", "dtjoin", {
      type: Sequelize.DATE,
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn("participants", "dtjoin");
  }
};
