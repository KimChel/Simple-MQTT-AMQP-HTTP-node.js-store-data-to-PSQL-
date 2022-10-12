console.log('Server side code running');

const express = require('express');
const app = express();
const port = 3000
const db = require('./queries.js')

app.use(express.static('public'));


app.post('/clicked', db.insertClickedData)
app.get('/data', db.getAllData)
app.post('/data', db.insertData)


app.listen(port, () => console.log(`App running on port ${port}`));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})