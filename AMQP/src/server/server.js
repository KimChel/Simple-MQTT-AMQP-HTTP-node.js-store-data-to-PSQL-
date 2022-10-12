var Rabbit = require('./amqp');
const rabbit = new Rabbit()

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

function send_temperature() {
    var message = {
        "value": random_float(13, 28, 2),
        "timestamp": get_date(),
        "point_id": random_number_from_1_to_21()
    }

    const messageString = JSON.stringify(message)
    console.log('sending temperature: ' + messageString)
    rabbit.sendMessage(messageString)
}


function connect(connectionString) {
    console.log('Connecting to RabbitMQ');
    rabbit.connect('amqp://localhost').then(() => {
        console.log('connected')
        setInterval(send_temperature, 3000)
    }).catch(err => {
        console.log(err)
        setTimeout(connect, 3000, connectionString)
    })
}

connect('amqp://localhost')