var amqplib = require('amqplib');

class Rabbit {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queueName = 'message';
    }

    connect(hostName) {
        return new Promise((resolve, reject) => {
            amqplib.connect(hostName).then(conn => {
                this.connection = conn;

                conn.createChannel().then(channel => {
                    this.channel = channel;

                    channel.assertQueue(this.queueName, {
                        durable: false,
                        autoDelete: true
                    }).then(() => {
                        resolve();

                    }).catch(err => reject('Connection failure'));
                }).catch(err => reject('Connection failure'));
            }).catch(err => reject('Connection failure'));
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (null != this.connection) {
                this.channel.deleteQueue(queueName);
                this.channel.close();
                this.connection.close();
                this.connection = null;
                this.channel = null;
                resolve();
            }
            reject('Not connected');
        })
    }

    sendMessage(message) {
        return new Promise((resolve, reject) => {
            if (null != this.channel) {
                this.channel.sendToQueue(this.queueName, new Buffer(message));
                resolve();
            } else {
                reject('Not connected');
            }
        })
    }

    receiveMessages(callback) {
        this.channel.consume(this.queueName, message => {
            if (null != message) {
                this.channel.ack(message);
                callback(message.content.toString());
            }
        });
    }
}

module.exports = Rabbit;
