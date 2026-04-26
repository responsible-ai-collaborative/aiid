import {
  ignoreWhitespace,
  insertContent,
} from './shared';

const getEmailTemplate = () => {

  const sectionStyle = ignoreWhitespace(`
    padding: 24px 0px;
    border-bottom: 1px solid #ccc;
    font-size: 90%;
  `);

  const incidentStyle = ignoreWhitespace(`
    padding: 16px 0px;
    font-size: 90%;
  `);

  const entityStyle = ignoreWhitespace(`
    border: 1px solid;
    text-decoration: none;
    padding: 2px 6px;
    margin: 0px 2px;
    border-radius: 4px;
  `);

  return insertContent(
    `
      <p style="margin-top: 0px;">
        Greetings,
      </p>

      <p>
        Here are the latest items from the AI Incident Database that match your subscriptions.
        You can manage your subscriptions from
        <a href="https://incidentdatabase.ai/account/">your account page</a>.
      </p>

      {% if newIncidents %}
        <div style="${sectionStyle}">
          <h2 style="font-size: 110%;">New Incidents</h2>
          {% for incident in newIncidents %}
            <div style="${incidentStyle}">
              <h3 style="font-size: 100%; margin-top: 0px;">
                <a href="{{ incident.incidentUrl }}">Incident {{ incident.incidentId }}: {{ incident.incidentTitle }}</a>
              </h3>
              <p style="font-size: 85%;">{{ incident.incidentDate }}</p>
              <p style="font-size: 85%;">{{ incident.incidentDescription }}</p>
              <p style="margin-bottom: 0px; line-height: 1.75;">
                <strong>Alleged</strong>:
                <span style="${entityStyle}">{{ incident.developers }}</span> developed an AI system deployed by
                <span style="${entityStyle}">{{ incident.deployers }}</span> which harmed
                <span style="${entityStyle}">{{ incident.entitiesHarmed }}</span>.
              </p>
            </div>
          {% endfor %}
        </div>
      {% endif %}

      {% if entityEvents %}
        <div style="${sectionStyle}">
          <h2 style="font-size: 110%;">Entity Updates</h2>
          {% for event in entityEvents %}
            <div style="${incidentStyle}">
              <p style="margin-top: 0px;">
                {% if event.isUpdate %}
                  An incident involving <a href="{{ event.entityUrl }}">{{ event.entityName }}</a> was updated.
                {% else %}
                  A new incident involving <a href="{{ event.entityUrl }}">{{ event.entityName }}</a> was added.
                {% endif %}
              </p>
              <h3 style="font-size: 100%;">
                <a href="{{ event.incidentUrl }}">Incident {{ event.incidentId }}: {{ event.incidentTitle }}</a>
              </h3>
              <p style="font-size: 85%;">{{ event.incidentDate }}</p>
              <p style="font-size: 85%;">{{ event.incidentDescription }}</p>
              <p style="margin-bottom: 0px; line-height: 1.75;">
                <strong>Alleged</strong>:
                <span style="${entityStyle}">{{ event.developers }}</span> developed an AI system deployed by
                <span style="${entityStyle}">{{ event.deployers }}</span> which harmed
                <span style="${entityStyle}">{{ event.entitiesHarmed }}</span>.
              </p>
            </div>
          {% endfor %}
        </div>
      {% endif %}

      {% if incidentUpdates %}
        <div style="${sectionStyle}">
          <h2 style="font-size: 110%;">Updates to Incidents You Follow</h2>
          {% for update in incidentUpdates %}
            <div style="${incidentStyle}">
              {% if update.reportTitle %}
                <p style="margin-top: 0px;">
                  A new report was added to
                  <a href="{{ update.incidentUrl }}">Incident {{ update.incidentId }}: {{ update.incidentTitle }}</a>:
                  <a href="{{ update.reportUrl }}">{{ update.reportTitle }}</a>{% if update.reportAuthor %} by {{ update.reportAuthor }}{% endif %}.
                </p>
              {% else %}
                <p style="margin-top: 0px;">
                  <a href="{{ update.incidentUrl }}">Incident {{ update.incidentId }}: {{ update.incidentTitle }}</a> was updated.
                </p>
              {% endif %}
            </div>
          {% endfor %}
        </div>
      {% endif %}

      {% if submissionsPromoted %}
        <div style="${sectionStyle}">
          <h2 style="font-size: 110%;">Your Approved Submissions</h2>
          {% for submission in submissionsPromoted %}
            <div style="${incidentStyle}">
              <p style="margin-top: 0px;">
                Your submission has been approved! View
                <a href="{{ submission.incidentUrl }}">Incident {{ submission.incidentId }}: {{ submission.incidentTitle }}</a>.
              </p>
              <p style="font-size: 85%;">{{ submission.incidentDate }}</p>
              <p style="font-size: 85%;">{{ submission.incidentDescription }}</p>
            </div>
          {% endfor %}
        </div>
      {% endif %}

      <p style="margin-bottom: 32px; margin-top: 32px;">
        Sincerely,<br>
        Responsible AI Collaborative
      </p>
    `,
    { title: 'AI Incident Database Notifications' }
  );
};

export default getEmailTemplate();
