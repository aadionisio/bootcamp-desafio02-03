import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        password_user: Sequelize.VIRTUAL
      },
      { sequelize }
    );

    this.addHook("beforeSave", async user => {
      if (user.password_user) {
        user.password = await bcrypt.hash(user.password_user, 8);
      }
    });

    return this;
  }

  checkpassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

export default User;
