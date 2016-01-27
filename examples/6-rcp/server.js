#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, connection) {
    connection.createChannel(function(err, channel) {
        var queue = 'rpc_queue';

        channel.assertQueue(queue, {durable: false});

        // parallel
        channel.prefetch(2, true);
        console.log(' [x] Awaiting RPC requests');

        channel.consume(queue, function reply(msg) {
            var n = parseInt(msg.content.toString());

            console.log(" [.] fib(%d)", n);

            var r = fibonacci(n);

            channel.sendToQueue(msg.properties.replyTo,
                new Buffer(r.toString()),
                {correlationId: msg.properties.correlationId});

            channel.ack(msg);
        });
    });
});

function fibonacci(n) {
    if (n == 0 || n == 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}
