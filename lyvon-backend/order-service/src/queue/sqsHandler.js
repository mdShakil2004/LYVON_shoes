const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const Order = require('../models/orderModel');
require('dotenv').config();

const sqs = new SQSClient({ region: process.env.AWS_REGION });

async function processQueue() {
  while (true) {
    try {
      const data = await sqs.send(new ReceiveMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20
      }));

      if (data.Messages) {
        for (const msg of data.Messages) {
          const { orderId, action } = JSON.parse(msg.Body);
          if (action === 'confirm') {
            await Order.findByIdAndUpdate(orderId, { status: 'processing' });
            // Add email/send notification logic here
            console.log(`Order ${orderId} confirmed`);
          }

          await sqs.send(new DeleteMessageCommand({
            QueueUrl: process.env.SQS_QUEUE_URL,
            ReceiptHandle: msg.ReceiptHandle
          }));
        }
      }
    } catch (err) {
      console.error('SQS error:', err);
    }
  }
}

processQueue();