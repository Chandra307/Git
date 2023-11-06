// import express = require('express');

import bodyParser from 'body-parser';
import express from 'express';
import { todo } from 'node:test';

import todosRoutes from './routes/todos';

const app = express();

app.use(bodyParser.json());
app.use(todosRoutes);

app.listen(3000);