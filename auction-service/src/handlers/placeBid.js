import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import { getAuctionById } from "./getAuction";

// Create new DynamoDB instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event, context) => {
  // Get auction ID from path params
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionById(id);

  // Validation for bid amount
  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}`
    );
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set highestBid.amount = :amount",
    ExpressionAttributeValues: {
      ":amount": amount,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedAuction;

  try {
    const result = await dynamoDB.update(params).promise();

    // Get all of the attributes of the object that was updated
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export const handler = commonMiddleware(placeBid);
