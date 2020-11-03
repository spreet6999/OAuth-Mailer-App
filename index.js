const express = require('express');
const app = express();
const router = require('express').Router();

const ApiRoutes = require('./routes/routes')
const dotenv = require('dotenv');

dotenv.config();
  
app.use(express.json());
  
app.use('/api/google', ApiRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT);

console.log('RESTful API server started on: ' + PORT);