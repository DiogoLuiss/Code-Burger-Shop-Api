module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "postgres",
  database: "codeburger",
  define: {
    timespamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
// Nesta parte vc tem que conectar o sequelize com o banco de dados
