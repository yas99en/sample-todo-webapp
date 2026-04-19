const db = require('../database');

class TodoController {
  getAll() {
    return db.prepare('SELECT * FROM todos ORDER BY priority ASC, deadline ASC, id DESC').all();
  }

  getById(id) {
    return db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  }

  create({ title, content, deadline, priority }) {
    const stmt = db.prepare(
      'INSERT INTO todos (title, content, deadline, priority) VALUES (?, ?, ?, ?)'
    );
    const info = stmt.run(title, content || null, deadline || null, priority || 2);
    return info.lastInsertRowid;
  }

  update(id, { title, content, deadline, priority }) {
    const stmt = db.prepare(
      `UPDATE todos
       SET title = ?, content = ?, deadline = ?, priority = ?,
           updated_at = datetime('now', 'localtime')
       WHERE id = ?`
    );
    stmt.run(title, content || null, deadline || null, priority || 2, id);
  }

  delete(id) {
    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  }
}

module.exports = new TodoController();
