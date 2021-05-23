import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

// Create new DynamoDB instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (event, context) => {
  let auctions;

  try {
    // Query the database for all auctions
    const result = await dynamoDB
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise();

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

export const handler = commonMiddleware(getAuctions);
