const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

const PRIORITIES = [
  { value: 1, label: '高' },
  { value: 2, label: '中' },
  { value: 3, label: '低' },
];

// List all todos
router.get('/', (req, res) => {
  const todos = todoController.getAll();
  res.render('index', { todos, priorities: PRIORITIES });
});

// Show create form
router.get('/new', (req, res) => {
  res.render('new', { priorities: PRIORITIES, error: null });
});

// Create a new todo
router.post('/', (req, res) => {
  const { title, content, deadline, priority } = req.body;
  if (!title || title.trim() === '') {
    return res.render('new', {
      priorities: PRIORITIES,
      error: 'タイトルは必須です',
      values: req.body,
    });
  }
  todoController.create({ title: title.trim(), content, deadline, priority: parseInt(priority, 10) });
  res.redirect('/todos');
});

// Show edit form
router.get('/:id/edit', (req, res) => {
  const todo = todoController.getById(req.params.id);
  if (!todo) return res.status(404).render('404');
  res.render('edit', { todo, priorities: PRIORITIES, error: null });
});

// Update a todo
router.post('/:id', (req, res) => {
  const { title, content, deadline, priority } = req.body;
  const id = req.params.id;
  if (!title || title.trim() === '') {
    const todo = todoController.getById(id);
    return res.render('edit', {
      todo,
      priorities: PRIORITIES,
      error: 'タイトルは必須です',
      values: req.body,
    });
  }
  todoController.update(id, { title: title.trim(), content, deadline, priority: parseInt(priority, 10) });
  res.redirect('/todos');
});

// Delete a todo
router.post('/:id/delete', (req, res) => {
  todoController.delete(req.params.id);
  res.redirect('/todos');
});

module.exports = router;
