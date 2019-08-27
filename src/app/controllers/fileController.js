import File from "../models/File";

class FileController {
  // criando metodo store
  async store(req, res) {
    console.log("fileController.js");
    // capturando o filename e path do arquivo

    const { filename, path } = req.file;

    // criando método para inserir no banco de dados

    const file = await File.create({
      filename,
      path
    });

    return res.json(file);
  }
}

export default new FileController();
