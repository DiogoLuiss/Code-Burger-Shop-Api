import * as Yup from "yup"
import Product from "../models/Product"
import Category from "../models/Categories"
import User from "../models/User"

class ProductController {
  async store(request, response) {
    const isAdmin = await User.findByPk(request.userId)

    if (!isAdmin.adm) {
      return response
        .status(401)
        .json({ message: "You don't have permition to do this" })
    }
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }
    const { filename: path } = request.file
    const { name, price, category_id } = request.body

    const product = await Product.create({
      name,
      price,
      category_id,
      path,
    })

    return response.status(200).json(product)
  }

  async index(request, response) {
    const products = await Product.findAll({
      include: [
        {
          model: Category, // Serve para relacionar com o grupo de informações
          as: "category",
          attributes: ["id", "name"], // Informações que eu vou puxar
        },
      ],
    })

    return response.json(products)
  }

  async update(request, response) {
    try {
      const isAdmin = await User.findByPk(request.userId)

      if (!isAdmin.adm) {
        return response
          .status(401)
          .json({ message: "You don't have permition to do this" })
      }
      const schema = Yup.object().shape({
        // como é atualizção nenhum campo é obrigatorio
        name: Yup.string(),
        price: Yup.number(),
        category_id: Yup.string(),
        offer: Yup.boolean(),
      })

      try {
        await schema.validateSync(request.body, { abortEarly: false })
      } catch (err) {
        return response.status(400).json({ error: err.errors })
      }

      const { id } = request.params

      const productExist = await Product.findByPk(id) // confirmando se o email existe
      if (!productExist) {
        return response
          .status(401)
          .json({ error: "make sure your id product is correct" })
      }

      let path // esse metodo é possivel fazer a aplicação procurar o arquivo apenas quando ele existe, sem isso iria bugar

      if (request.file) {
        path = request.file.filename
      }

      const { name, price, category_id, offer } = request.body

      await Product.update(
        {
          name,
          price,
          category_id,
          path,
          offer,
        },
        { where: { id } } // é ecessario especificar onde vc quer mudar as informações, usando id por exemplo
      )

      return response
        .status(200)
        .json({ message: "product successfully updated " })
    } catch (err) {
      return response.json({ error: err.errors })
    }
  }
}
export default new ProductController()
