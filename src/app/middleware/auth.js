// Esse arquivo puxa o valor do Token e manda para outro lugar

import jwt from "jsonwebtoken"
import authConfig from "../../config/path"

export default (request, response, next) => {
  const authTokem = request.headers.authorization

  if (!authTokem) {
    return response.status(401).json({ error: "Token is provided" })
  }

  const formatToken = authTokem.split(" ")[1]
  // split serve para separar em arrays de acordo com a informação podendo ser um expaço, virgula etc..

  try {
    jwt.verify(formatToken, authConfig.tokem, function (err, decoded) {
      if (err) {
        throw new Error()
      }

      // jwt.verify serve para verificar o tokem criado pelo servidor e o mandado pelo usuario, se não for compativel ele quebra o código.
      request.userId = decoded.id
      request.userName = decoded.name
      // como usamos o decoded as informaões são guardadas no token
      // quando se guarda informações aqui no request vc consegue puxar em qualquer lugar
    })
  } catch (error) {
    return response.status(401).json({ Error: "Token is invalid" })
  }
  console.log(formatToken)

  return next() // sem isso a aoplicação iria parar ao executar aqui
}
