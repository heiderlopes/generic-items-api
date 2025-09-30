const express = require("express");
const router = express.Router();

// "DB" em memória (substitua por DB real depois)
let items = [];

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - rm
 *       properties:
 *         rm:
 *           type: string
 *           description: RM do usuário
 *       additionalProperties: true
 *       example:
 *         rm: "2023001"
 *         titulo: "Livro de Node.js"
 *         autor: "Heider Lopes"
 *         preco: 49.9
 */

/**
 * @swagger
 * tags:
 *   - name: Itens
 *     description: Operações com itens genéricos por RM
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Insere um novo item (genérico) vinculado a um RM
 *     tags: [Itens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item criado com sucesso
 */
router.post("/", (req, res) => {
  const { rm } = req.body;
  if (!rm) return res.status(400).json({ error: "O campo 'rm' é obrigatório" });

  const id = Date.now().toString(); // id simples (único)
  const newItem = { id, ...req.body };
  items.push(newItem);
  res.status(201).json({ message: "Item criado", item: newItem });
});

// /**
//  * @swagger
//  * /items:
//  *   get:
//  *     summary: Lista todos os itens
//  *     tags: [Itens]
//  *     responses:
//  *       200:
//  *         description: Lista de itens
//  */
// router.get("/", (req, res) => {
//   res.json(items);
// });

/**
 * @swagger
 * /items/{rm}:
 *   get:
 *     summary: Lista os itens de um usuário pelo RM
 *     tags: [Itens]
 *     parameters:
 *       - in: path
 *         name: rm
 *         schema:
 *           type: string
 *         required: true
 *         description: RM do usuário
 *     responses:
 *       200:
 *         description: Itens do usuário
 */
router.get("/:rm", (req, res) => {
  const { rm } = req.params;
  const filtered = items.filter((item) => item.rm === rm);
  res.json(filtered);
});

// /**
//  * @swagger
//  * /items/{rm}/{id}:
//  *   put:
//  *     summary: Atualiza um item pelo RM e ID (parcial/total)
//  *     tags: [Itens]
//  *     parameters:
//  *       - in: path
//  *         name: rm
//  *         schema:
//  *           type: string
//  *         required: true
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Item'
//  *     responses:
//  *       200:
//  *         description: Item atualizado
//  */
// router.put("/:rm/:id", (req, res) => {
//   const { rm, id } = req.params;
//   const idx = items.findIndex((it) => it.rm === rm && it.id === id);
//   if (idx === -1) return res.status(404).json({ error: "Item não encontrado" });

//   // Mantém id e rm do path; mescla o resto
//   items[idx] = {
//     ...items[idx],
//     ...req.body,
//     id: items[idx].id,
//     rm: items[idx].rm,
//   };
//   res.json({ message: "Item atualizado", item: items[idx] });
// });

/**
 * @swagger
 * /items/{rm}/{id}:
 *   delete:
 *     summary: Exclui um item pelo RM e ID
 *     tags: [Itens]
 *     parameters:
 *       - in: path
 *         name: rm
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Item excluído
 */
router.delete("/:rm/:id", (req, res) => {
  const { rm, id } = req.params;
  const before = items.length;
  items = items.filter((item) => !(item.rm === rm && item.id === id));
  if (items.length === before)
    return res.status(404).json({ error: "Item não encontrado" });
  res.json({ message: "Item excluído com sucesso" });
});

module.exports = router;
