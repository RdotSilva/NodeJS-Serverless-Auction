import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "@middy/validator";
import createError from "http-errors";
import { setAuctionImageUrl } from "../lib/setAuctionImageUrl";
import { uploadPictureToS3 } from "../lib/uploadPictureToS3";
import { getAuctionById } from "./getAuction";
import uploadAuctionImageSchema from "../lib/schemas/uploadAuctionImage";

const uploadAuctionPicture = async (event) => {
  // Get the auction ID
  const { id } = event.pathParameters;

  const { email } = event.requestContext.authorizer;

  // Find the auction
  const auction = await getAuctionById(id);

  // Check to make sure use has proper authorization to upload image
  if (auction.seller !== email) {
    throw new createError.Forbidden(`You are not the seller of this auction`);
  }

  // Create base64 image
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  let updatedAuction;

  try {
    // Set the image URL and upload set image URL to auction
    const imageUrl = await uploadPictureToS3(auction.id + ".jpg", buffer);
    updatedAuction = await setAuctionImageUrl(auction.id, imageUrl);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ updatedAuction }),
  };
};

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler())
  .use(validator({ inputSchema: uploadAuctionImageSchema }));
