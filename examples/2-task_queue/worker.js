#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

// create connection
amqp.connect('amqp://localhost', function(err, connection) {

    // create channel
    connection.createChannel(function(err, channel) {
        var queue = 'task';

        channel.assertQueue(queue, {durable: true});
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        // consume
        channel.consume(queue, function(msg) {
            var secs = msg.content.toString().split('.').length - 1;

            // resource intensive task
            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function() {
                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {noAck: false});
    });
});
