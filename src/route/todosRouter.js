import express from "express";
import authMiddleWare from "../middleware/authMiddleware.js";
import db from "../db.js"; // Add this line to import the db module

const router = express.Router();
router.use(authMiddleWare);
router.get("/", (req, res) => {
  // Get all todos for a user
  const getTodos = db.prepare("SELECT * FROM todos WHERE user_id = ?");
  const todos = getTodos.all(req.userId);
  return res.json(todos);
});

router.post("/", (req, res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(
    "INSERT INTO todos (user_id, task) VALUES (?, ?)"
  );
  try {
    const result = insertTodo.run(req.userId, task);
    res.status(201).json({
      message: "Todo created",
      id: result.lastInsertRowid,
      completed: false,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating todo", error: err });
    console.error(err);
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const updateTodo = db.prepare("UPDATE todos SET completed = ? WHERE id = ?");
  try {
    updateTodo.run(completed, id);
    res.status(200).json({ message: "Todo updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating todo", error: err });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const deleteTodo = db.prepare(
    "DELETE FROM todos WHERE id = ? AND user_id = ?"
  );
  try {
    deleteTodo.run(id, req.userId);
    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo", error: err });
  }
});

export default router;
