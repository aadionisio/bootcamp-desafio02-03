import jwt from "jsonwebtoken";

import { promisify } from "util";
import authConfig from "../../config/authconfig";

export default async (req, res, next) => {
  // extrair a informação do token enviado pela requisição

  const authHeader = req.headers.authorization;

  // caso a informação nao venha, enviar mensagem

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  // extrair o token da informação vinda da requisição

  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userid = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token Invalid" });
  }
};
