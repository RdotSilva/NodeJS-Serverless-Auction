// JSON Place Bid  schema validation
const schema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        amount: {
          type: "number",
        },
      },
      required: ["amount"],
    },
  },
  required: ["body"],
};

export default schema;
