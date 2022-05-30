import Sequelize from "sequelize"
import mongoose from "mongoose"

import Product from "../app/models/Product"
import User from "../app/models/User"
import Categories from "../app/models/Categories"

import configDatabase from "../config/database"

const models = [User, Product, Categories]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  // o nome connection poderia ser qualquer um
  init() {
    this.connection = new Sequelize(configDatabase) // essa codigo é essencial
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      "mongodb://localhost:27017/codeburger",
      { useNewUrlParser: true, useunifiedTopology: true }
    )
  }
}

export default new Database()

// Aqui se faz a conexão do Model com a database
