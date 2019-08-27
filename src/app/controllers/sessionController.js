import jwt from "jsonwebtoken";
import User from "../models/User";
import authConfig from "../../config/authconfig";

class SessionController {
  // criando metodo store
  async store(req, res) {
    // capturando email e senha da requisição

    const { email, password_user } = req.body;

    // verificar se o usuario existe

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "user not found!" });
    }

    // verificar se a senha bate

    if (!(await user.checkpassword(password_user))) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    // fazer a autenticação e retornar o token para o usuario (retornar id, name, email e token)

    // recuperando o id e name

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email
      },
      // jwt 3 parametros. 1 - objeto com informações que eu quero enviar no token, 2 - chave unica do tokem, objeto com algumas definicções do tokem
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessionController();
