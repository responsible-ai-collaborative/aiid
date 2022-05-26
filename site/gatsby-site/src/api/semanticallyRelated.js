const axios = require('axios');

export default async function handler(req, res) {
  const { text } = req.query;

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
    encodeURIComponent(text);

  axios
    .get(url)
    .then((lambdaResponse) => {
      const data = lambdaResponse.data.body.msg.split(',');

      // See: https://github.com/responsible-ai-collaborative/nlp-lambdas/issues/9
      const incidents = [
        parseInt(data[1].split(')')[0]),
        parseInt(data[3].split(')')[0]),
        parseInt(data[5].split(')')[0]),
      ];

      res.status(200).json({ incidents: incidents });
    })
    .catch((error) => {
      console.error(error);
    });
}
