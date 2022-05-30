import Sequelize, { Model } from "sequelize"
import bcrypt from "bcrypt"

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        adm: Sequelize.BOOLEAN,
      },
      { sequelize }
    )
    // serve para criptografar a senha
    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 11)
        // o numero significa o nivel da criptografia
      }
    })
    return this
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash)
  }
}

export default User
// os models sempre precisam, ser exportados para o index das migrations, necessario se conectar
// Model faz a interface entre a aplicação e o banco de dados, toda manipulação de dados é responsavel pelo model
