const sendEmail = async ({ to, subject, text, templateFileName, data, userIds = [] }) => {
  const url = `/api/sendEmail`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ to, subject, text, templateFileName, data, userIds }),
  });

  if (!response?.ok) {
    console.error('/api/sendEmail', response);
    throw new Error('Error sending email');
  }
  const json = await response.json();

  return json;
};

export default sendEmail;
