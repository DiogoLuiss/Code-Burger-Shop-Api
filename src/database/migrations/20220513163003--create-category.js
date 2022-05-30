module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "category_id", {
      type: Sequelize.INTEGER,
      references: { model: "categories", Key: "id" }, // Este codigo faz o relacionamento entre banco de dados e o outro.
      onUpdate: "CASCADE", // Para atualizar ambas as tabelas
      onDelete: "SET NULL", // deletar coisas de ambas as tabelas
      allowNull: true,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("products", "category_id")
  },
}
