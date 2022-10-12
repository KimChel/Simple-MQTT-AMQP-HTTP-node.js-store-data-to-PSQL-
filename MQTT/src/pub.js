// MQTT publisher
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:7574')
var topic = 'iotpoints'



client.on('connect', () => {
    setInterval(() => {
        var message = {
            "value": random_float(13, 28, 2),
        }
        const messageString = JSON.stringify(message)
        client.publish(topic, messageString)
        
        console.log('sending temperature: ' + messageString)

    }, 5000)
})

function random_float(min, max, decimals) {
    var num = 0;
    num = (Math.random() * (max - min) + min).toFixed(decimals);
    return num.toString();
}