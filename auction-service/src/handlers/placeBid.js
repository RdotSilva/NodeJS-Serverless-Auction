import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import { getAuctionById } from "./getAuction";
import validator from "@middy/validator";
import placeBidSchema from "../lib/schemas/placeBidSchema";

// Create new DynamoDB instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event, context) => {
  // Get auction ID from path params
  const { id } = event.pathParameters;
  const { amount } = event.body;

  // Get user info from the authorizer context
  const { email } = event.requestContext.authorizer;

  const auction = await getAuctionById(id);

  // Validation for user identify
  if (email == auction.seller) {
    throw new createError.Forbidden(`You cannot bid on your own auctions`);
  }

  // Validation for double bidding
  if (email == auction.highestBid.bidder) {
    throw new createError.Forbidden(`You are already the highest bidder`);
  }

  // Validation for auction that is closed
  if (auction.status === "CLOSED") {
    throw new createError.Forbidden(
      `Can't bid on this item the auction has closed`
    );
  }

  // Validation for bid amount
  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}`
    );
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "set highestBid.amount = :amount, highestBid.bidder = :bidder",
    ExpressionAttributeValues: {
      ":amount": amount,
      ":bidder": email,
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

export const handler = commonMiddleware(placeBid).use(
  validator({ inputSchema: placeBidSchema })
);
