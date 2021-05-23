import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

// Create new DynamoDB instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export const handler = commonMiddleware(placeBid);
