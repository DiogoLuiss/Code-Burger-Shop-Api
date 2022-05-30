import * as Yup from "yup"
import User from "../models/User"
import jwt from "jsonwebtoken"
import sign from "../../config/path"

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    // schema.isValid retorna apenas se é true ou false

    if (!(await schema.isValid(request.body))) {
      return response
        .status(401)
        .json({ error: "Make sure your email or password is correct" })
    }
    const { email, password } = request.body
    const user = await User.findOne({
      where: { email },
      // serve para verificar se tem a informação no banco de dados, se tiver vem true se não vem false
    })
    if (!user) {
      return response
        .status(401)
        .json({ error: "Make sure your email or password is correct" })
    }
    if (!(await user.checkPassword(password))) {
      return response
        .status(401)
        .json({ error: "Make sure your email or password is correct" })
    }

    return response.json({
      id: user.id,
      email,
      name: user.name,
      adm: user.adm,
      token: jwt.sign({ id: user.id, name: user.name }, sign.tokem, {
        // serve para criar uma segurança maior em seus sites, primeiro é o Id segundo o token, e terceiro de quanto em quanto tempo vai inspirar
        expiresIn: sign.expiresIn,
      }),
    })
  }
}
// mandar as informações para o routes
export default new SessionController()
