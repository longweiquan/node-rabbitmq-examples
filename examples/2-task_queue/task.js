#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

// create connection
amqp.connect('amqp://localhost', function(err, connection) {

    // create channel
    connection.createChannel(function(err, ch) {
        var queue = 'task';
        var msg = process.argv.slice(2).join(' ') || "Hello World!";

        ch.assertQueue(queue, {durable: true});

        // send message to queue
        ch.sendToQueue(queue, new Buffer(msg), {persistent: true});
        console.log(" [x] Sent '%s'", msg);
    });

    // close connection after a timeout
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
