const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

// Create express app
const app = express();
const port = 5000;

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});
// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});
	 	 	 	
//app.set("view engine", "ejs");

app.get('/api', (req, res) => {
    //const data = {name: 'Mario'};
    //res.render('index', data);
    res.json({"users": ["Jaden", "Mario"]})
});

app.get('/user', (req, res) => {
    teammembers = []
    pool
        .query('SELECT * FROM teammembers;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                teammembers.push(query_res.rows[i]);
            }
            const data = {teammembers: teammembers};
            console.log(teammembers);
            //res.render('us m er', data);
            res.json(data)
        });
});

app.get('/find-order/:id', (req, res) => {
    var id = req.params.id;
    var sql = "SELECT o.id as order_id, " +
              "o.status_code as order_status, " +
              "sta.name as order_status_name, " +
              "i.name as item_name, " +
              "s.name as size_name, " +
              "od.parent_order_detail_id as parent_order, " +
              "m.price as price " +
              "FROM orders o " +
              "INNER JOIN order_detail od ON o.id = od.order_id " +
              "INNER JOIN status sta ON o.status_code = sta.code " +
              "INNER JOIN menu m ON od.menu_id = m.id " +
              "INNER JOIN item i ON m.item_id = i.id " +
              "INNER JOIN drink_size s ON m.drink_size_code = s.code " +
              "WHERE od.order_id = " + id
              "ORDER BY order_detail_id; ";

    order = []
    pool
        .query(sql)
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                order.push(query_res.rows[i]);
            }
            const data = {order: order};
            console.log(order);
            res.json(data)
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
