import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Set the auction image URL in DynamoDB
export const setAuctionImageUrl = async (id, imageUrl) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set imageUrl = :imageUrl",
    ExpressionAttributeValues: {
      ":imageUrl": imageUrl,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDB.update(params).promise();

  return result.Attributes;
};
