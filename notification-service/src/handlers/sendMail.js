import AWS from "aws-sdk";
import { notificationEmailSource } from "../../config";

const ses = new AWS.SES({ region: "us-east-1" });

const sendMail = async (event, context) => {
  // Get the SQS record from the event
  const record = event.Records[0];
  console.log(`Record Processing: ${record}`);

  // Get email information from body
  const email = JSON.parse(record.body);
  const { subject, body, recipient } = email;

  const params = {
    Source: notificationEmailSource,
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
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
