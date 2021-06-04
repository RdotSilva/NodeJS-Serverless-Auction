import { getAuctionById } from "./getAuction";

const uploadAuctionPicture = async (event) => {
  // Get the auction ID
  const { id } = event.pathParameters;

  // Find the auction
  const auction = await getAuctionById(id);

  // Create base64 image
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};

export const handler = uploadAuctionPicture;
