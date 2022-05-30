import * as Yup from "yup"
import Product from "../models/Product"
import Category from "../models/Categories"
import Order from "../schemas/Order"
import User from "../models/User"

class OrderController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          // of serve para vc fazer a validação de campos dentro de arrays
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    })

    // abortEarly serve para mostrar todos os erros e não parar apenas no primeiro, deve estar false
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.json(err.errors)
    }

    const productsId = request.body.products.map((product) => product.id)

    const updateProduct = await Product.findAll({
      where: {
        id: productsId,
      },
      include: [
        {
          model: Category, // Serve para relacionar com o grupo de informações
          as: "category",
          attributes: ["name"], // Informações que eu vou puxar
        },
      ],
    })

    const editedProduct = updateProduct.map((product) => {
      const productIndex = request.body.products.findIndex(
        (requestProduct) => requestProduct.id === product.id
      )

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: request.body.products[productIndex].quantity, // dessa maneira vc consegue colocar apenas um campo na inforação
      }

      return newProduct
    })

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: editedProduct,
      status: "Pedido realizado",
    }
    console.log(order)
    const orderResponse = await Order.create(order)

    return response.status(201).json(orderResponse)
  }

  async index(request, response) {
    const isAdmin = await User.findByPk(request.userId) // essa função pega todas as informações do usuario logado, por meio do id

    if (!isAdmin.adm) {
      return response
        .status(401)
        .json({ message: "You don't have permition to do this" })
    }
    const orders = await Order.find() // com essa função se pode requerir todas as informações de Orders

    return response.json(orders)
  }

  async update(request, response) {
    const isAdmin = await User.findByPk(request.userId) // essa função pega todas as informações do usuario logado, por meio do id

    if (!isAdmin.adm) {
      return response
        .status(401)
        .json({ message: "You don't have permition to do this" })
    }
    const schema = Yup.object().shape({
      status: Yup.string().required(),
    })

    // abortEarly serve para mostrar todos os erros e não parar apenas no primeiro, deve estar false
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.json(err.errors)
    }

    const { id } = request.params // com o params pegamos o valor da url
    const { status } = request.body

    try {
      await Order.updateOne({ _id: id }, { status }) // essa função serve para atualizar informações do banco de dados, o
      // primeiro paramretro ele usa para comparar se existe aquela informação, ex _id: id, o segundo serve para atualizar a informação.
    } catch (error) {
      return response.status(401).json({ error: error.message })
    }

    return response.status(200).json({ message: "Status has been changed" })
  }
}
// sempre deve mandar a função para o routes.
export default new OrderController()

// //Controller  onde as informações vao entrar na aplicação e onde se faz validações

// metodos utilizados

// store => Cadastrar / Adicionar
// index => Listar varios
// show => Listar apenas Um
// update => Atualizar
// delete => Deletar
