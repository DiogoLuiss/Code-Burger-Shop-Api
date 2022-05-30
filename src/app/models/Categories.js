import Sequelize, { Model } from "sequelize"

class Categories extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3000/category-file/${this.path}`
          },
        },
      },
      { sequelize }
    )
    return this // se esse esta fazendo referencia com outro arquivo é necessario dar um return this
  }
}
export default Categories
// os models sempre precisam, ser exportados para o index das migrations, necessario se conectar
