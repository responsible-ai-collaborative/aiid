const axios = require('axios');

export default async function handler(req, res) {
  const { text, num } = req.query;

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
  const url =
    'https://q3z6vr2qvj.execute-api.us-west-2.amazonaws.com/text-to-db-similar?text=' +
    encodeURIComponent(text) +
    '&num=' +
    num;

  axios
    .get(url)
    .then((lambdaResponse) =>
      res.status(200).json({
        // See: https://github.com/responsible-ai-collaborative/nlp-lambdas/issues/9
        incidents: eval(lambdaResponse.data.body.msg.replace(/\(/g, '[').replace(/\)/g, ']')).map(
          (arr) => ({ incident_id: arr[1], similarity: arr[0] })
        ),
      })
    )
    .catch((error) => {
      console.error(error);
    });
}
