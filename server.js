const express = require('express');
const routes = require('./routes');
const { Sequelize } = require('sequelize');
const mysql = require('mysql2');


const sequelize = new Sequelize('ecommerce_db', 'root', 'jecsHcEvKh32yQ2rEuMP', {
  host: 'localhost',
  dialect: 'mysql',
});

const { Product, Category, Tag, ProductTag } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

sequelize.sync()
  .then(() => {
    console.log('Database synchronized successfully');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  })
  .catch((err) => {
    console.error('Error syncing the database:', err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// ...
