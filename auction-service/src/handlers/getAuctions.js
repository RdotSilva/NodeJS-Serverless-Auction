import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import validator from "@middy/validator";
import getAuctionsSchema from "../lib/schemas/getAuctionsSchema";

// Create new DynamoDB instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (event, context) => {
  let auctions;

  // Get status from params
  const { status } = event.queryStringParameters;

  // Use global secondary index to get all auctions filtered by status
  const queryParams = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  try {
    // Query the database for all auctions
    const result = await dynamoDB.query(queryParams).promise();

    // Get the items of the database query
    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
};

export const handler = commonMiddleware(getAuctions).use(
  validator({ inputSchema: getAuctionsSchema, useDefaults: true })
);
