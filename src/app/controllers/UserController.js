import { v4 } from "uuid"
import User from "../models/User"
import * as Yup from "yup"

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      adm: Yup.boolean(),
    })
    // abortEarly serve para mostrar todos os erros e não parar apenas no primeiro, deve estar false
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.json(err.errors)
    }

    const { name, email, password, adm } = request.body
    // serve para verificar  se o email ja existe, sem quebrar o servidor
    const UserExists = await User.findOne({
      where: { email },
    })
    if (UserExists) {
      return response.status(400).json({ error: "email already registered" })
    }
    console.log(UserExists)
    // O models precisa estar ligado aqui para que possa criar novas informações no banco de dados
    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      adm,
    })

    return response.status(201).json(user)
  }
}
// sempre deve mandar a função para o routes.
export default new UserController()

// //Controller  onde as informações vao entrar na aplicação e onde se faz validações

// metodos utilizados

// store => Cadastrar / Adicionar
// index => Listar varios
// show => Listar apenas Um
// update => Atualizar
// delete => Deletar
