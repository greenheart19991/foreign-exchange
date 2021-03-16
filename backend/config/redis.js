const redis = require('redis');
const config = require('./config');

const client = redis.createClient({
    port: config.redis.port,
    host: config.redis.host,
    password: config.redis.password,
    no_ready_check: true
});

client.on('error', (err) => {
    throw err;
});

module.exports = client;
