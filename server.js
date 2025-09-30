const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const path = require("path");

//const itemsRoutes = require("./routes/items");
const genericRoutes = require("./routes/generic");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos (HTML, CSS, JS) da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

// Lista de temas
const temas = [
  {
    description: "Livros",
    fields: ["imagem", "título", "descrição do livro", "ano de publicação"],
  },
  {
    description: "Carros",
    fields: ["imagem", "título", "descrição do livro", "ano de publicação"],
  },
  {
    description: "Escolas",
    fields: ["imagem", "título", "descrição do livro", "ano de publicação"],
  },
  {
    description: "Comidas",
    fields: ["imagem", "título", "descrição do livro", "ano de publicação"],
  },
  {
    description: "Futebol",
    fields: ["imagem", "título", "descrição do livro", "ano de publicação"],
  },
];

// Endpoint que retorna o tema por RM
app.get("/api/tema/:rm", (req, res) => {
  const rm = parseInt(req.params.rm);

  if (isNaN(rm)) {
    return res.status(400).json({ error: "RM inválido" });
  }

  const indice = rm % temas.length;
  res.json({
    rm: rm,
    tema: temas[indice],
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
