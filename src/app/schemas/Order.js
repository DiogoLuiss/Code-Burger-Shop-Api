import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
  {
    user: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    products: [
      {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        url: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    status: { type: String, required: true },
  },
  {
    timestamps: true, // Essa tag é essencial para tenha as informações da data de atualização e criação dos dados
  }
)

export default mongoose.model("Order", OrderSchema) // Primeiro parametro é o nome que vc quer dar ao exporta o arquivo e o segundo é a const
