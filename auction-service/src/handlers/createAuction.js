const createAuction = async (event, context) => {
  // Get the body data from the event
  const { title } = JSON.parse(event.body);

  // Get current date
  const now = new Date();

  // Create new auction item
  const auction = {
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
  };
  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = createAuction;
