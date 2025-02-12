import { withSentry } from "../../sentry-instrumentation";
import * as Sentry from "@sentry/aws-serverless";

const axios = require('axios');

const handler = async function (event) {
  const { text, max_retries, num, includeSimilar = true } = JSON.parse(event.body);

  // Example result
  // {
  //    "isBase64Encoded": false,
  //    "statusCode": 200,
  //    "headers": {"Content-Type": "application/json"},
  //    "multiValueHeaders": {},
  //    "body": {
  //      "warnings": [],
  //      "msg": "[(0.9972602725028992, 10), (0.996686577796936, 73), (0.9966337084770203, 134)]",
  //      "best_url": "https://incidentdatabase.ai/apps/discover?display=details&incident_id=10"
  //  }}

  const awsRoot = 'https://q3z6vr2qvj.execute-api.us-west-2.amazonaws.com';

  let similarResponse;

  let embeddingResponse;

  let tries = 0;

  let error = null;

  while (
    tries < (max_retries || 6) &&
    (embeddingResponse?.status !== 200 || similarResponse?.status !== 200 || error)
  ) {
    error = null;
    try {
      await Sentry.startSpan((span) => {
        span.setDescription("Request to the text-to-embed endpoint");
        span.setData("text", text);
        span.setTag("max_retries", max_retries);
        span.setTag("num", num);
        span.setTag("includeSimilar", includeSimilar);
      }, async () => {

        // Request to the text-to-embed endpoint
        embeddingResponse = await axios({
          url: awsRoot + '/text-to-embed',
          method: 'POST',
          data: {
            text: text,
          },
        });
      });


      if (embeddingResponse?.status === 200) {
        const embedding = embeddingResponse.data.body.embedding;

        const embeddingString = JSON.stringify(embedding.vector);

        if (includeSimilar) {

          await Sentry.startSpan((span) => {
            span.setDescription("Request to the embed-to-db-similar endpoint");
            span.setData("num", num);
            span.setData("embeddingString", embeddingString);
          }, async () => {

            // Request to the embed-to-db-similar endpoint
            similarResponse = await axios({
              url: awsRoot + '/embed-to-db-similar',
              method: 'POST',
              data: {
                num: String(num || 3),
                embed: embeddingString,
              },
            });
          });

          if (similarResponse?.status === 200) {
            // Parsing the response
            const parsedEmbedding = JSON.parse(
              similarResponse.data.body.msg.replace(/\(/g, '[').replace(/\)/g, ']')
            );

            return {
              statusCode: 200,
              body: JSON.stringify({
                embedding,
                incidents: parsedEmbedding.map((arr) => ({
                  incident_id: arr[1],
                  similarity: arr[0],
                })),
              }),
            };
          }
        } else {
          return {
            statusCode: 200,
            body: JSON.stringify({ embedding }),
          };
        }
      }
    } catch (e) {
      error = e;
      console.error(e);
    }
    tries++;
  }

  return {
    statusCode: 500,
    body: JSON.stringify({ error: error?.message || 'Unknown error occurred' }),
  };
};

module.exports = { handler: withSentry(handler) };