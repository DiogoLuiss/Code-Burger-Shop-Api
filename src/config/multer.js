import multer from "multer"
import { v4 } from "uuid"
import { extname, resolve } from "path"
export default {
  storage: multer.diskStorage({
    // callback é como se fosse a resposta
    destination: resolve(__dirname, "..", "..", "uploads"),
    filename: (request, file, callback) => {
      return callback(null, v4() + extname(file.originalname))
    },
  }),
}
// extname serve para pegar a estensão do arquivo, e file.originalname() e essa função pega a extensão do arquivo
