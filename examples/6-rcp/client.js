#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: rpc_client.js num");
    process.exit(1);
}

// create connection
amqp.connect('amqp://localhost', function(err, connection) {

    // create channel
    connection.createChannel(function(err, ch) {

        // Use temporary queue for consumption
        ch.assertQueue('', {exclusive: true}, function(err, queue) {
            var correlationId = generateUuid();
            var num = parseInt(args[0]);
            console.log(' [x] Requesting fib(%d)', num);

            // handle response by activate ACK option and using the same correlationId
            ch.consume(queue.queue, function(msg) {
                if (msg.properties.correlationId == correlationId) {
                    console.log(' [.] Got %s', msg.content.toString());
                }
            }, {noAck: true});

            // send request
            setInterval(function() {
                console.log('sendToQueue');
                ch.sendToQueue('rpc_queue', new Buffer(num.toString()), { correlationId: correlationId, replyTo: queue.queue });
            }, 500);
        });
    });
});

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}