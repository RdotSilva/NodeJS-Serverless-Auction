import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";

// Create new DynamoDB instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event, context) => {
  // Get the body data from the event
  const { title } = JSON.parse(event.body);

  // Get current date
  const now = new Date();

  // Create new auction item
  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
  };

  // Insert auction into DB
  await dynamoDB
    .put({
      TableName: "AuctionsTable",
      Item: auction,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = createAuction;
