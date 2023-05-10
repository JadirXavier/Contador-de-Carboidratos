const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Conectar ao banco de dados
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir modelo para a coleção nutrients
const Nutrient = mongoose.model("Nutrient", {
  nome: String,
  carboidratos: String,
});

// Configurar o middleware body-parser para converter as requisições em JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("public"));

// Configurar as rotas da API
app.get("/nutrients", async (req, res) => {
  try {
    const query = req.query.q;
    const words = query.trim().split(/\s+/); // Quebra a query em palavras

    const regex = new RegExp(
      `^${words[0]}[^\w]*${words[1] ? `\\b.*${words[1]}` : ""}[^\w]*${
        words[2] ? `\\b.*${words[2]}` : ""
      }[^\w]*$`,
      "i"
    ); // Captura as palavras da query na ordem em que foram escritas
    const nutrients = await Nutrient.find({ nome: { $regex: regex } });

    res.json(nutrients);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});
