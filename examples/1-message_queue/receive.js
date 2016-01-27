#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

// create connection
amqp.connect('amqp://localhost', function(err, connection) {

    // create channel
    connection.createChannel(function(err, channel) {
        var queue = 'hello';

        channel.assertQueue(queue, {durable: false});
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        // consume message
        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {noAck: true});

        // close connection after timeout
        setTimeout(function() {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
