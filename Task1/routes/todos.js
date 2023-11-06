"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let todos = [];
router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post('/todo', (req, res, next) => {
    const newTodo = {
        id: new Date().toISOString(),
        text: req.body.text
    };
    todos.push(newTodo);
    res.status(201).json({ message: "Todo created", todos: todos });
});
router.put('/todo/:todoId', (req, res, next) => {
    const tId = req.params.todoId;
    const index = todos.findIndex(elem => elem.id === tId);
    if (index >= 0) {
        todos[index] = { id: todos[index].id, text: req.body.text };
        return res.status(200).json({ message: 'Updated todo', todos: todos });
    }
    res.status(404).json({ message: 'No todo found' });
});
router.delete('/todo/:todoId', (req, res, next) => {
    const tId = req.params.todoId;
    const index = todos.findIndex(todo => todo.id === tId);
    if (index >= 0) {
        todos = todos.filter(todo => todo.id !== tId);
        return res.status(200).json({ message: 'Todo deleted', todo: todos[index] });
    }
    res.status(404).json({ message: 'Todo not found' });
});
exports.default = router;
