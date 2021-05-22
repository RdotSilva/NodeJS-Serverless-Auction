import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

// Create new DynamoDB instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event, context) => {
  // Get the body data from the event
  const { title } = event.body;

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
  try {
    await dynamoDB
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = commonMiddleware(createAuction);
