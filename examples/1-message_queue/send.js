#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

// create connection
amqp.connect('amqp://localhost', function(err, connection) {

    // create channel
    connection.createChannel(function(err, channel) {
        var queue = 'hello';
        channel.assertQueue(queue, {durable: false});

        // send message
        channel.sendToQueue(queue, new Buffer('Hello World!'));
        console.log(" [x] Sent 'Hello World!'");
    });

    // close connection after timeout
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
