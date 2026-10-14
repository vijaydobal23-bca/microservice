import amqp from "amqplib";

let connection;
let channel;

export const connectRabbitMq = async () => {
  if (channel) {
    return channel;
  }

  const rabbitUrl =
    process.env.RABBITMQ_URL || process.env.RABBIT_URL || "amqp://localhost";

  connection = await amqp.connect(rabbitUrl);
  channel = await connection.createChannel();

  console.log("RabbitMQ connected");

  return channel;
};

export const publishToQueue = async (queueName, data) => {
  const rabbitChannel = await connectRabbitMq();
  const message = typeof data === "string" ? data : JSON.stringify(data);

  await rabbitChannel.assertQueue(queueName, {
    durable: true,
  });

  return rabbitChannel.sendToQueue(queueName, Buffer.from(message), {
    persistent: true,
  });
};

export const subscribeToQueue = async (queueName, handler) => {
  const rabbitChannel = await connectRabbitMq();

  await rabbitChannel.assertQueue(queueName, {
    durable: true,
  });

  await rabbitChannel.consume(queueName, async (message) => {
    if (!message) {
      return;
    }

    try {
      await handler(message.content.toString());
      rabbitChannel.ack(message);
    } catch (error) {
      console.log("RabbitMQ consumer error - >", error);
      rabbitChannel.nack(message, false, true);
    }
  });
};

export const closeRabbitMq = async () => {
  if (channel) {
    await channel.close();
    channel = null;
  }

  if (connection) {
    await connection.close();
    connection = null;
  }
};
