import AWS from "aws-sdk";
import { notificationEmailSource } from "../../config";

const ses = new AWS.SES({ region: "us-east-1" });

const sendMail = async (event, context) => {
  const params = {
    Source: notificationEmailSource,
    Destination: {
      ToAddresses: [notificationDestinationEmail],
    },
    Message: {
      Body: {
        Text: {
          Data: "Hello World",
        },
      },
      Subject: {
        Data: "Test Mail",
      },
    },
  };
};

export const handler = sendMail;
