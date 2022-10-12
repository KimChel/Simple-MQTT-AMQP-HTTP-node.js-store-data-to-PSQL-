//MQTT broker
var mosca = require('mosca');
require('dotenv').config()
var port = { port: 7574 }
var broker = new mosca.Server(port);

function get_date() {
    var date = new Date()
    return date
}

function random_number_from_1_to_21() {
    var num = 0;
    num = Math.floor(Math.random() * (21 - 1 + 1)) + 2;
    return num.toString();
}

// Postgresql connection
var Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST_ADDRESS,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT
})

pool.connect(() => {
    console.log('Connected to Postgresql');
})

broker.on('ready', () => {
    console.log("Broker is online")
})

broker.on('published', (packet, client) => {
    let { payload } = packet

    if (payload) {

        try {
            let payloadJson = JSON.parse(payload)
            console.log(payloadJson)
            var sql = "INSERT INTO iot_values (date, point_id, value) VALUES ($1, $2, $3)";
            var data = [get_date(), random_number_from_1_to_21(), payloadJson.value];
            pool.query(sql, data, (err, res) => {
                if (err) {
                    console.log('ERROR: ', err)
                } else {
                    console.log('Data inserted' + res)
                }
            })
        } catch (err) {
            console.log("invalid json" + err)
        }
    }
}
)





