const Pool = require('pg').Pool
require('dotenv').config()
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST_ADDRESS,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT
})

const insertData = (req, res) => {
    const { id, data_desc, data_type } = req.body;

    pool.query("INSERT INTO iot_values (date, point_id, value) VALUES ($1, $2, $3)", [id, data_desc, data_type], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`Data added with ID: ${id}`)
    })
}

const getAllData = (req, res) => {
    pool.query('SELECT * FROM iot_values', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    }
    )
}

const insertClickedData = (req, res) => {
    const click = {
        date: get_date(),
        point_id: random_number_from_1_to_21(),
        value: random_float(13, 28, 2)
    }

    function get_date() {
        var date = new Date()
        return date
    }

    function random_number_from_1_to_21() {
        var num = 0;
        num = Math.floor(Math.random() * (21 - 1 + 1)) + 2;
        return num.toString();
    }

    function random_float(min, max, decimals) {
        var num = 0;
        num = (Math.random() * (max - min) + min).toFixed(decimals);
        return num.toString();
    }

    pool.query("INSERT INTO iot_values (date, point_id, value) VALUES ($1, $2, $3)", [click.date, click.point_id, click.value], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`Data added with ID: ${click.date}`)
    })
}

module.exports = {
    insertData,
    getAllData,
    insertClickedData
}