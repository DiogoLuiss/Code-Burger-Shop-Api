import routes from "./routes"
import express from "express"
import { resolve } from "path"

import "./database"

class App {
  constructor() {
    this.app = express()
    this.middlewares()
    this.router()
  }

  middlewares() {
    this.app.use(express.json())
    this.app.use(
      "/product-file",
      express.static(resolve(__dirname, "..", "uploads"))
    )
    this.app.use(
      "/category-file",
      express.static(resolve(__dirname, "..", "uploads"))
    )
  }

  router() {
    this.app.use(routes)
  }
}

export default new App().app
