const axios = require('axios');

export default async function handler(req, res) {
  const { text, max_retries, num, includeSimilar = true } = JSON.parse(req.body);

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
      embeddingResponse = await axios({
        url: awsRoot + '/text-to-embed',
        method: 'POST',
        data: {
          text: text,
        },
      });
      if (embeddingResponse?.status === 200) {
        const embedding = embeddingResponse.data.body.embedding;

        const embeddingString = JSON.stringify(embedding.vector);

        if (includeSimilar) {
          similarResponse = await axios({
            url: awsRoot + '/embed-to-db-similar',
            method: 'POST',
            data: {
              num: String(num || 3),
              embed: embeddingString,
            },
          });
          if (similarResponse?.status === 200) {
            // See: https://github.com/responsible-ai-collaborative/nlp-lambdas/issues/9
            const parsedEmbedding = JSON.parse(
              similarResponse.data.body.msg.replace(/\(/g, '[').replace(/\)/g, ']')
            );

            res.status(200).json({
              embedding,
              incidents: parsedEmbedding.map((arr) => ({
                incident_id: arr[1],
                similarity: arr[0],
              })),
            });
            return;
          }
        } else {
          res.status(200).json({ embedding });
          return;
        }
      }
    } catch (e) {
      error = e;
      console.error(e);
    }
    tries++;
  }
  res.status(500).json({ error });
}
