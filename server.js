const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Nutrient = mongoose.model("Nutrient", {
  nome: String,
  carboidratos: String,
});

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/nutrients", async (req, res) => {
  try {
    const query = req.query.q;
    const words = query.trim().split(/\s+/);

    const regex = new RegExp(
      `^${words[0]}[^\w]*${words[1] ? `\\b.*${words[1]}` : ""}[^\w]*${
        words[2] ? `\\b.*${words[2]}` : ""
      }[^\w]*$`,
      "i"
    );
    const nutrients = await Nutrient.find({ nome: { $regex: regex } });

    res.json(nutrients);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor iniciado na porta ${process.env.PORT}`);
});
