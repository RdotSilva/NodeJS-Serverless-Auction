import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export const closeAuction = async (auction) => {
  // Set up DB call to close an auction
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  await dynamoDB.update(params).promise();

  const { title, seller, highestBid } = auction;
  const { amount, bidder } = highestBid;

  // Check if no bids were placed and notify seller to re-list item
  if (amount == 0) {
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: "No bids on your auction item",
          recipient: seller,
          body: `Sorry but there were no bids on "${title}", try listing the item at a lower price.`,
        }),
      })
      .promise();
    return;
  }

  // Notify a seller that their auction has ended
  const notifySeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "Your item has been sold",
        recipient: seller,
        body: `Congrats! Your item "${title}" has been sold for $${amount}.`,
      }),
    })
    .promise();

  // Notify a bidder that they have won an auction
  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "You have won an auction!",
        recipient: bidder,
        body: `Congrats! You have won "${title}" for $${amount}`,
      }),
    })
    .promise();

  return Promise.all([notifyBidder, notifySeller]);
};
