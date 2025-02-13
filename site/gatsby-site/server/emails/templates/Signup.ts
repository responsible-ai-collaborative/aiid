import {
  insertContent,
} from './shared'

const getEmailTemplate = () => {

  return insertContent(
    `
      <div>
        <p>
          Click the link below to verify your email address for the AI Incident Database:
        </p>

        <p style="font-size: 85%;">
          {{magicLink}}
        </p>

        <p>
          This link will expire in 24 hours. If you did not request this email, please ignore it.
        </p>
      </div>

      <p style="margin-bottom: 32px">
        Sincerely,<br>
        Responsible AI Collaborative
      </p>
    `,
    { title: 'Signup' }
  );
};

export default getEmailTemplate();
