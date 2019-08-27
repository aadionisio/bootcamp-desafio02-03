// import { identity } from "rxjs";
import * as Yup from "yup";
import User from "../models/User";

class UserController {
  async store(req, res) {
    // Validando os dados de entrada

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      password_user: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const userExists = User.findOne({ where: { email: req.body.email } });

    if (!userExists) {
      return res.status(401).json({ error: "User already exists." });
    }

    const user = await User.create(req.body);

    return res.json(user);
  }

  // metodo para alterar os dados do usuario

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password_user: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when(
        "password_user",
        (password_user, field) =>
          password_user
            ? field.required().oneOf([Yup.ref("password_user")])
            : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const { email, oldpassword } = req.body;

    // localizando o usuario no banco

    const user = await User.findByPk(req.userid);

    // validando se houve mudança de email pelo usuario

    if (email !== user.email) {
      // verificando se o email existe
      const userExists = User.findOne({ where: { email } });

      if (!userExists) {
        return res.status(401).json({ error: "User already exists." });
      }
    }

    // validando se o usuario tentou alterar a senha
    // se o usuario preencheu a senha e a mesma estiver errada.. criticar. se ele preencheu e enviou correta nem entra no bloco
    if (oldpassword && !(await user.checkpassword(oldpassword))) {
      return res.status(401).json({ error: "Password does not match" });
    }

    // alterando os dados do usuario no banco

    const { id, name } = await user.update(req.body);

    return res.json({
      user: { id, name, email }
    });
  }
}

export default new UserController();
