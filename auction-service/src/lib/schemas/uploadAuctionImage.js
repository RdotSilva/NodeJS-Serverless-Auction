// JSON Create Auction schema validation
const schema = {
  type: "object",
  properties: {
    body: {
      type: "string",
      minLength: 1,
      pattern: "=$", // Regex to make sure string ends with = sign
    },
  },
  required: ["body"],
};

export default schema;
