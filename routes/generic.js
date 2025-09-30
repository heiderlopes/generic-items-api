const express = require("express");
const router = express.Router();

// "Banco" em memória genérico (coleções dinâmicas)
let db = {}; // Ex: { livros: [], produtos: [], ... }

/**
 * @swagger
 * components:
 *   schemas:
 *     GenericItem:
 *       type: object
 *       required:
 *         - rm
 *       properties:
 *         rm:
 *           type: string
 *           description: "RM do usuário"
 *       additionalProperties: true
 *       example:
 *         rm: "2023001"
 *         nome: "Exemplo"
 *         preco: 99.9
 */

/**
 * @swagger
 * tags:
 *   - name: Genérico
 *     description: "Operações genéricas para qualquer coleção (livros, produtos, etc)"
 */

/**
 * @swagger
 * /{collection}:
 *   post:
 *     summary: "Insere um item genérico em qualquer coleção"
 *     tags: [Genérico]
 *     parameters:
 *       - in: path
 *         name: collection
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nome da coleção (ex: livros, produtos)"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericItem'
 *     responses:
 *       201:
 *         description: "Item criado com sucesso"
 */
router.post("/:collection", (req, res) => {
  const { collection } = req.params;
  const { rm } = req.body;

  if (!rm) return res.status(400).json({ error: "O campo 'rm' é obrigatório" });

  if (!db[collection]) db[collection] = [];

  const id = Date.now().toString();
  const newItem = { id, ...req.body };
  db[collection].push(newItem);

  res.status(201).json({ message: "Item criado", item: newItem });
});

/**
 * @swagger
 * /{collection}:
 *   get:
 *     summary: "Lista todos os itens de uma coleção"
 *     tags: [Genérico]
 *     parameters:
 *       - in: path
 *         name: collection
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nome da coleção (ex: livros, produtos)"
 *     responses:
 *       200:
 *         description: "Lista de itens"
 */
router.get("/:collection", (req, res) => {
  const { collection } = req.params;
  res.json(db[collection] || []);
});

/**
 * @swagger
 * /{collection}/{rm}:
 *   get:
 *     summary: "Lista itens de uma coleção filtrados por RM"
 *     tags: [Genérico]
 *     parameters:
 *       - in: path
 *         name: collection
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nome da coleção (ex: livros, produtos)"
 *       - in: path
 *         name: rm
 *         required: true
 *         schema:
 *           type: string
 *         description: "RM do usuário"
 *     responses:
 *       200:
 *         description: "Itens filtrados por RM"
 */
router.get("/:collection/:rm", (req, res) => {
  const { collection, rm } = req.params;
  const filtered = (db[collection] || []).filter((item) => item.rm === rm);
  res.json(filtered);
});

/**
 * @swagger
 * /{collection}/{rm}/{id}:
 *   delete:
 *     summary: "Exclui item pelo RM e ID em uma coleção"
 *     tags: [Genérico]
 *     parameters:
 *       - in: path
 *         name: collection
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nome da coleção (ex: livros, produtos)"
 *       - in: path
 *         name: rm
 *         required: true
 *         schema:
 *           type: string
 *         description: "RM do usuário"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID do item"
 *     responses:
 *       200:
 *         description: "Item excluído"
 */
router.delete("/:collection/:rm/:id", (req, res) => {
  const { collection, rm, id } = req.params;
  if (!db[collection]) db[collection] = [];

  const before = db[collection].length;
  db[collection] = db[collection].filter(
    (item) => !(item.rm === rm && item.id === id)
  );

  if (db[collection].length === before) {
    return res.status(404).json({ error: "Item não encontrado" });
  }

  res.json({ message: "Item excluído com sucesso" });
});

module.exports = router;
