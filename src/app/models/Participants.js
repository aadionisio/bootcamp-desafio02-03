import Sequelize, { Model } from "sequelize";

class Participant extends Model {
  static init(sequelize) {
    super.init(
      {
        dtjoin: Sequelize.DATE
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: "meetup_id" });
    this.belongsTo(models.User, { foreignKey: "user_id" });
  }
}

export default Participant;
