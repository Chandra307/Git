import { Router } from "express";
import { time } from "node:console";

import { Todo } from '../models/todo';

type RequestBody = { text: string };
type RequestParams = { todoId: string };

const router = Router();

let todos: Todo[] = [];

router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todos });
})

router.post('/todo', (req,  res, next) => {
    const body = req.body as RequestBody;
    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: body.text
    }
    todos.push(newTodo);
    res.status(201).json( { message: "Todo created", todos: todos});
})

router.put('/todo/:todoId', (req, res, next) => {
    const params = req.params as RequestParams;
    const tId = params.todoId;
    const body = req.body as RequestBody;
    const index = todos.findIndex(elem => elem.id === tId);
    if (index >= 0){

        todos[index] = { id: todos[index].id, text: body.text };
        return res.status(200).json({ message: 'Updated todo', todos: todos });
    }
    res.status(404).json({ message: 'No todo found'});
})  

router.delete('/todo/:todoId', (req, res, next) => {
    const params = req.params as RequestParams;
    const tId = params.todoId;
    const index = todos.findIndex(todo => todo.id === tId);
    if (index >= 0) {

        todos = todos.filter(todo => todo.id !== tId );
        return res.status(200).json({ message: 'Todo deleted', todo: todos[index] });
    }
    res.status(404).json({ message: 'Todo not found' });
})

export default router;