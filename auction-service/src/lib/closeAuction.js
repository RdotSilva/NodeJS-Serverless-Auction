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
};
