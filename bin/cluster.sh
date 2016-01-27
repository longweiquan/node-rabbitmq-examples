#!/bin/bash

SETUP_MATER="
  RABBITMQ_NODE_PORT=5672 RABBITMQ_NODENAME=rabbit rabbitmq-server
"

SETUP_SLAVE="
    RABBITMQ_NODE_PORT=5673 RABBITMQ_NODENAME=hare rabbitmq-server
    rabbitmqctl -n hare stop_app
    rabbitmqctl -n hare join_cluster rabbit@localhost
    rabbitmqctl -n hare start_app
"

echo "Setup RabbitMQ Master";
echo "=====================";
`bash -c '$SETUP_MATER'`

echo "Setup RabbitMQ Slaves";
echo "=====================";
`bash -c '$SETUP_SLAVE'`
