import sgMail from '@sendgrid/mail';
import { promises as fs } from 'fs';
import path from 'path';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const { to, subject, text, templateFileName, body, data, userIds = [] } = JSON.parse(req.body);

  let html = templateFileName
    ? await fs.readFile(path.resolve(`./src/emailTemplates/${templateFileName}.html`), 'utf8')
    : body;

  const personalizations = [];

  for (let i = 0; i < to.length; i++) {
    personalizations.push({
      to: [
        {
          email: to[i],
        },
      ],
      substitutions: {
        ...data,
        email: to[i],
        userId: i < userIds.length ? userIds[i] : undefined,
      },
    });
  }
  to.map((recipient) => {
    return {
      to: [
        {
          email: recipient,
        },
      ],
      substitutions: { ...data, email: recipient },
    };
  });

  const msg = {
    to,
    from: 'notifications@incidentdatabase.ai',
    subject,
    text,
    html,
    personalizations,
  };

  try {
    const sendResult = await sgMail.send(msg, to.length > 1);

    res.status(200).json(sendResult);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
}
