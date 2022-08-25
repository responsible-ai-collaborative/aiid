import sgMail from '@sendgrid/mail';
import { promises as fs } from 'fs';
import path from 'path';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const { to, subject, text, templateFileName, body, data } = JSON.parse(req.body);

  let html = templateFileName
    ? await fs.readFile(path.resolve(`./src/emailTemplates/${templateFileName}.html`), 'utf8')
    : body;

  const msg = {
    to,
    from: 'notifications@incidentdatabase.ai',
    subject,
    text,
    html,
    personalizations: [
      {
        to: [
          {
            email: to,
          },
        ],
        substitutions: data,
      },
    ],
  };

  try {
    const sendResult = await sgMail.send(msg);

    res.status(200).json(sendResult);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
}
