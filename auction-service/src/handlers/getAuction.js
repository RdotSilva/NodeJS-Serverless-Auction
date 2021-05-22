import AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

// Create new DynamoDB instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getAuction = async (event, context) => {
  let auction;

  // Get auction ID from path params
  const { id } = event.pathParameters;

  try {
    const result = await dynamoDB
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID ${id} not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

export const handler = middy(getAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
