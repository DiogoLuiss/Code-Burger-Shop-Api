import * as Yup from "yup"
import Category from "../models/Categories"
import User from "../models/User"

class CategoriesController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    })

    const { name } = request.body

    const verify = typeof name
    const N = "number"

    if (verify === N) {
      return response.status(400).json({ Error: "you need to put a name" })
    }

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.json(err.errors)
    }

    const isAdmin = await User.findByPk(request.userId)

    if (!isAdmin.adm) {
      return response
        .status(401)
        .json({ message: "You don't have permition to do this" })
    }

    const nameExist = await Category.findOne({
      where: { name },
    })
    if (nameExist) {
      return response.status(400).json({ error: "this name already exist" })
    }

    const { filename: path } = request.file

    const categories = await Category.create({
      name,
      path,
    })
    const Id = categories.id

    return response.status(201).json({ Id, name })
  }

  async index(request, response) {
    const categories = await Category.findAll()

    return response.json(categories)
  }

  async update(request, response) {
    const isAdmin = await User.findByPk(request.userId)

    if (!isAdmin.adm) {
      return response
        .status(401)
        .json({ message: "You don't have permition to do this" })
    }
    const schema = Yup.object().shape({
      name: Yup.string(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.json(err.errors)
    }

    const { id } = request.params

    const categoryExist = await Category.findByPk(id)

    if (!categoryExist) {
      response
        .status(401)
        .json({ error: "make sure your id product is correct" })
    }

    // if (categoryExist) {
    //   console.log(name)
    //   return response.status(400).json(categoryExist)
    // }

    let path

    if (request.file) {
      path = request.file.filename
    }

    const { name } = request.body

    await Category.update(
      {
        name,
        path,
      },
      { where: { id } }
    )

    return response
      .status(200)
      .json({ message: "product successfully updated " })
  }
}

export default new CategoriesController()
