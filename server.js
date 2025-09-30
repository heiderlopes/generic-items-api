const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const path = require("path");

const temas = require("./temas.json"); // importa o JSON

//const itemsRoutes = require("./routes/items");
const genericRoutes = require("./routes/generic");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos (HTML, CSS, JS) da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

// Endpoint que retorna o tema por RM
app.get("/api/tema/:rm", (req, res) => {
  const rm = parseInt(req.params.rm);

  if (isNaN(rm)) {
    return res.status(400).json({ error: "RM inválido" });
  }

  // Procura o tema que contém o RM
  const temaEncontrado = temas.find((t) => t.rmList.includes(rm));

  if (!temaEncontrado) {
    return res.status(404).json({ error: "RM não encontrado" });
  }

  res.json({
    rm: rm,
    tema: temaEncontrado.tema,
    description: temaEncontrado.description,
    fields: temaEncontrado.fields,
  });
});

// Rotas da API
//app.use("/items", itemsRoutes);
app.use("/api", genericRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📖 Swagger: http://localhost:${PORT}/api-docs`);
});
