const utils = require('./utils');

connectionString = 'amqp://localhost'

function connect(rabbit, connectionString) {
    return new Promise((resolve, reject) => {
        console.log('Connecting to RabbitMQ');
        rabbit.connect(connectionString).then(() => {
            console.log('Successfully connected to RabbitMQ');
            resolve()
        }).catch(err => {
            console.log('Error connecting to RabbitMQ');
            utils.delay(3000, rabbit, connectionString).then(() => {
                connect(rabbit, connectionString).then(() => {
                    resolve();
                })
            })
        })
    })
}

module.exports.connectRabbit = connect


