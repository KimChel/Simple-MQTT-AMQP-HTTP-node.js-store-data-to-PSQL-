const pg = require('pg');
const format = require('pg-format');

var MyClient;

module.exports.connect = (host, database, user, password) => {
    return new Promise((resolve, reject) => {
        const pool = new pg.Pool({
            host: host,
            database: database,
            user: user,
            password: password
        })
        connectToPostgres(pool).then(client => {
            console.log('Connected to Postgres')
            MyClient = client
            resolve()
        })
    });
}

function connectToPostgres(pool) {
    return new Promise((resolve, reject) => {

        const timerPromise = new Promise((resolve, reject) => {
            setTimeout(() => null, 5000)
        })

        const connectPromise = new Promise((resolve, reject) => {
            attemptConnection(pool).then(client => {
                resolve(client)
            }).catch(err => {
                console.log('Error connecting to Postgres')
                resolve(null)

            })
        })

        Promise.race([timerPromise, connectPromise]).then(client => {
            if (null != client) {
                resolve(client)
                return
            }

            console.log('Postgres connection failure, retrying...')

            Utils.delay(3000, pool).then((pool) => {
                connectToPostgres(pool).then(client => resolve(client)
                )
            })
        })
    })
}

function attemptConnection(pool) {
    return new Promise((resolve, reject) => {
        console.log('Attempting to connect to Postgres')
        pool.connect().then(client => {
            resolve(client)
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports.query = (query => {
    return new Promise((resolve, reject) => {
        if (null == MyClient) {
            reject('Not connected to Postgres')
        }
        MyClient.query(query, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(res)
        })
    })
})
