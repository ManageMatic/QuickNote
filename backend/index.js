const connectToMongo = require('./db');
const express = require('express');

const app = express();
const port = 5000;

connectToMongo();

app.use(express.json());

// Define your routes here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
