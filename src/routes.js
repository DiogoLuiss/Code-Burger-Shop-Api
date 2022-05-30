import { Router } from "express"

import SessionController from "./app/controllers/SessionController"
import UserController from "./app/controllers/UserController"
import ProductController from "./app/controllers/ProductController"
import CategoryController from "./app/controllers/CategoryController"
import OrderController from "./app/controllers/OrderController"

import multerConfig from "./config/multer"
import multer from "multer"

import authMiddleware from "./app/middleware/auth"

const upload = multer(multerConfig)
// sempre tem que ser nesse formato, para poder configurar o multer na rota
const routes = new Router()

routes.post("/users", UserController.store)

routes.post("/sessions", SessionController.store)

routes.use(authMiddleware) // routes use serve para aplicar essa função para todas as rotas a aixo dela

routes.post("/products", upload.single("file"), ProductController.store)
routes.get("/products", ProductController.index)
routes.put("/products/:id", upload.single("file"), ProductController.update) // mesmo na atualização de informações é essencial o  upload

routes.post("/category", upload.single("file"), CategoryController.store)
routes.get("/category", CategoryController.index)
routes.put("/category/:id", upload.single("file"), CategoryController.update)

routes.post("/order", OrderController.store)
routes.get("/order", OrderController.index)
routes.put("/order/:id", OrderController.update)
// sempre que usar o id tem que ser assim.

export default routes
