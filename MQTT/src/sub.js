// MQTT subscriber
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:7574')
var topic = 'iotpoints'

client.on('message', (topic, message) => {
    let payloadString = message.toString()
    let payloadJson = JSON.parse(payloadString)
    console.log(payloadJson)
})

client.on('connect', () => {
    client.subscribe(topic)
})