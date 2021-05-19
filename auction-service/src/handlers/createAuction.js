const createAuction = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Auction Created" }),
  };
};

export const handler = createAuction;
