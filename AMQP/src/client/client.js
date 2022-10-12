const Rabbit = require('./amqp');
const RabbitOpt = require('./amqpOpt');
const pg = require('./pg');
const express = require('express');
require('dotenv').config()

let connectionString = 'amqp://localhost'
const rabbit = new Rabbit()
const app = express()

function onConnected() {
    console.log("Connected to RabbitMQ")
    rabbit.receiveMessages(onMessageRecieved)
}

function onMessageRecieved(message) {
    console.log(`Recieved: ${message}`)
    var json = JSON.parse(message)
    var query = "INSERT INTO iot_values (date, point_id, value) VALUES ('" + json.timestamp + "', " + json.point_id + ", "+ json.value +");"
    var data = [json.timestamp, json.point_id, json.value]
    pg.query(query).then(()=> console.log('Inserted'))
}

function getData() {
    return new Promise((resolve, reject) => {
        pg.query('SELECT * FROM iot_values').then((result) => {
            resolve(result.rows);
        })
    });
}

app.get('/', (req, res) => {
    getData().then(data => {
        res.send(JSON.stringify(data))
    })
})

app.listen(3001, () =>
    console.log('Example app listening on port 3000!'))

var rabbitConnection = RabbitOpt.connectRabbit(rabbit, connectionString)
var pgConnect = pg.connect(process.env.HOST_ADDRESS, process.env.USER, process.env.DATABASE, process.env.PASSWORD)

Promise.all([rabbitConnection, pgConnect]).then(() => {
    onConnected()
})

