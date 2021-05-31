import AWS from "aws-sdk";
import {
  notificationEmailSource,
  notificationDestinationEmail,
} from "../../config";

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

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const handler = sendMail;
