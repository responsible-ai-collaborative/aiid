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

  const imageStyle = ignoreWhitespace(`
    display: block;
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    border: 0;
    margin: 0 0 12px 0;
  `);

  const preheaderStyle = ignoreWhitespace(`
    display: none;
    max-height: 0px;
    overflow: hidden;
    mso-hide: all;
  `);

  const footerStyle = ignoreWhitespace(`
    margin-top: 32px;
    font-size: 85%;
    color: #666;
  `);

  return insertContent(
    `
      <div style="${preheaderStyle}">
        The latest incidents and updates from the AI Incident Database matching your subscriptions.
      </div>

      <p style="margin-top: 0px;">
        Greetings,
      </p>

      <p>
        Here are the latest items from the AI Incident Database that match your subscriptions.
        You can manage your subscriptions from
        <a href="https://incidentdatabase.ai/account/">your account page</a>.
      </p>

      {% if newIncidents and newIncidents|length > 0 %}
        <div style="${sectionStyle}">
          <h2 style="font-size: 110%;">New Incidents ({{ newIncidents|length }})</h2>
          {% for incident in newIncidents %}
            <div style="${incidentStyle}">
              {% if incident.reportImageUrl %}
                <img src="{{ incident.reportImageUrl }}" alt="Incident image" style="${imageStyle}">
              {% endif %}
              <h3 style="font-size: 100%; margin-top: 0px;">
                <a href="{{ incident.incidentUrl }}">Incident {{ incident.incidentId }}: {{ incident.incidentTitle }}</a>
              </h3>
              <p style="font-size: 85%;">{{ incident.incidentDate }}</p>
              <p style="font-size: 85%;">{{ incident.incidentDescription }}</p>
              {% if incident.editorNotes %}
                <p style="font-size: 85%;"><strong>Editor Notes</strong>: {{ incident.editorNotes }}</p>
              {% endif %}
              <p style="margin-bottom: 0px; line-height: 1.75;">
                <strong>Alleged</strong>:
                <span style="${entityStyle}">{{ incident.developers }}</span> developed an AI system deployed by
                <span style="${entityStyle}">{{ incident.deployers }}</span> which harmed
                <span style="${entityStyle}">{{ incident.entitiesHarmed }}</span>.
              </p>
              {% if incident.implicatedSystems %}
                <p style="margin-bottom: 0px; margin-top: 8px; font-size: 85%;">
                  AI systems implicated: <span style="${entityStyle}">{{ incident.implicatedSystems }}</span>.
                </p>
              {% endif %}
            </div>
          {% endfor %}
        </div>
      {% endif %}

      {% if entityEvents and entityEvents|length > 0 %}
        <div style="${sectionStyle}">
          <h2 style="font-size: 110%;">Entity Updates ({{ entityEvents|length }})</h2>
          {% for event in entityEvents %}
            <div style="${incidentStyle}">
              <p style="margin-top: 0px;">
                {% if event.isUpdate %}
                  An incident involving <a href="{{ event.entityUrl }}">{{ event.entityName }}</a> was updated.
                {% else %}
                  A new incident involving <a href="{{ event.entityUrl }}">{{ event.entityName }}</a> was added.
                {% endif %}
              </p>
              {% if event.reportImageUrl %}
                <img src="{{ event.reportImageUrl }}" alt="Incident image" style="${imageStyle}">
              {% endif %}
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
              {% if event.implicatedSystems %}
                <p style="margin-bottom: 0px; margin-top: 8px; font-size: 85%;">
                  AI systems implicated: <span style="${entityStyle}">{{ event.implicatedSystems }}</span>.
                </p>
              {% endif %}
            </div>
          {% endfor %}
        </div>
      {% endif %}

      {% if incidentUpdates and incidentUpdates|length > 0 %}
        <div style="${sectionStyle}">
          <h2 style="font-size: 110%;">Updates to Incidents You Follow ({{ incidentUpdates|length }})</h2>
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

      {% if submissionsPromoted and submissionsPromoted|length > 0 %}
        <div style="${sectionStyle}">
          <h2 style="font-size: 110%;">Your Approved Submissions ({{ submissionsPromoted|length }})</h2>
          {% for submission in submissionsPromoted %}
            <div style="${incidentStyle}">
              {% if submission.reportImageUrl %}
                <img src="{{ submission.reportImageUrl }}" alt="Incident image" style="${imageStyle}">
              {% endif %}
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

      <p style="margin-bottom: 0px; margin-top: 32px;">
        Sincerely,<br>
        Responsible AI Collaborative
      </p>

      <p style="${footerStyle}">
        You are receiving this email because you subscribed to notifications from the AI Incident Database.
        <a href="https://incidentdatabase.ai/account/">Manage your subscriptions or unsubscribe</a>.
      </p>
    `,
    { title: 'AI Incident Database Notifications' }
  );
};

export default getEmailTemplate();
