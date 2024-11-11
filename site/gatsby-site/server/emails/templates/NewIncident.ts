  import { 
  ignoreWhitespace,
  insertContent,
  bodyStyle,
  wrapperStyle,
  headerStyle,
  headerTitleStyle,
  mainActionLink,
} from '../shared.ts'

const getEmailTemplate = () => {
  
  // Styles in this function should be unique to this template.
  // They get inlined at the appropriate places
  // (better supported across email clients than <style> tags).
  const incidentStyle = ignoreWhitespace(`
    padding: 32px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    font-size: 90%;
  `);

  const incidentImageStyle = ignoreWhitespace(`
    border-radius: 8px;
    float: right; 
    margin-top: 16px;
    margin-left: 16px;
    margin-bottom: 16px;
  `);

  const entityStyle = ignoreWhitespace(`
    border: 1px solid;
    text-decoration: none;
    padding: 2px 6px;
    margin: 0px 2px;
    border-radius: 4px;
  `);

  // Wraps the main email content in header, footer, etc.
  // Template variables wrapped in {{ }} are handled per-email by MailerSend.
  // We also use regular JavaScript string templating ${} 
  // to construct the Sendgrid template
  // -- the values from these don't differ per-email,
  // they're just for organizing the code.
  return insertContent(
    `
      <p style="margin-top: 0px;">
        Greetings,
      </p>

      <p>
        A <a href="{{incidentUrl}}">new incident</a> has been added to the AI incident database.
        You can manage your subscriptions to these notifications from
        <a href="">your account page</a>.
      </p>

      <div style="${incidentStyle}">
        <h1 style="font-size: 100%; margin-top: 0px;">
          Incident {{incidentId}}: {{incidentTitle}}
        </h1>

        <p style="font-size: 85%;">{{incidentDate}}</p>

        <p style="font-size: 85%;">
          {{incidentDescription}}
        </p>
        <p style="margin-bottom: 0px; line-height: 1.75;">
          <strong>Alleged</strong>:
          <a href="" style="${entityStyle}">{{developers}}</a> developed an AI system deployed by
          <a href="" style="${entityStyle}">{{deployers}}</a> which harmed 
          <a href="" style="${entityStyle}">{{entitiesHarmed}}</a>.
        </p>
      </div>
      <p style="margin-bottom: 32px">
        Sincerely,<br>
        Responsible AI Collaborative
      </p>
    `,
    { title: 'New Incident' }
  );
};

export default getEmailTemplate();
