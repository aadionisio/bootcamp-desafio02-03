export default async (req, res, next) => {
  // validar se o arquivo foi informado na requisição
  console.log("uploadFile.js");
  if (!req.file) {
    return res.status(401).json({ error: "file not sended" });
  }

  // capturando o filename e path do arquivo

  const { mimetype } = req.file;

  // validar se o arquivo enviado é uma imagem

  const [typefile, ext] = mimetype.split("/");

  if (typefile !== "image") {
    return res.status(401).json({ error: "file is not image" });
  }

  //  return next();
};
