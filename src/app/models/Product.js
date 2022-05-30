import Sequelize, { Model } from "sequelize"

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN, // sempre que adiocionar um campo no banco de dados é necessario mudar o model
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3000/product-file/${this.path}`
          },
        },
      },
      { sequelize }
    )
    return this
  }

  static associate(models) {
    this.belongsTo(models.Categories, {
      // belongsTo significa pertecente a, e serve para fazer ligação entre arquivos,
      foreignKey: "category_id", // foreignkey significa chave estranha, serve para fazer referencia de outro arquivo
      as: "category",
    })
  }
}
export default Product
// os models sempre precisam, ser exportados para o index das migrations, necessario se conectar
