import {
  ignoreWhitespace,
  insertContent,
  bodyStyle,
  wrapperStyle,
  headerStyle,
  headerTitleStyle,
  mainActionLink,
} from './shared';

const getEmailTemplate = () => {
  const sectionStyle = ignoreWhitespace(`
    padding: 24px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    font-size: 90%;
  `);

  const incidentStyle = ignoreWhitespace(`
    padding: 32px;
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

  return insertContent(
    `
      <p style="margin-top: 0px;">
        Greetings,
      </p>

      <p>
        This is your Weekly AI Incident Briefing, summarizing the latest activity on the AI Incident Database.
        Stay informed about new incidents, reports, blog posts, and platform updates.
      </p>

      <div style="${sectionStyle}">
        <h2>New Incidents & Reports</h2>
        {% if newIncidents %}
          <ul>
            {% for incident in newIncidents %}
              <li style="list-style-type: none;">
                <div style="${incidentStyle}">
                  <h1 style="font-size: 100%; margin-top: 0px;">
                    Incident {{ incident.id }}: {{ incident.title }}
                  </h1>

                  <p style="font-size: 85%;">{{ incident.date }}</p>

                  <p style="font-size: 85%;">
                    {{ incident.description }}
                  </p>
                  <p style="margin-bottom: 0px; line-height: 1.75;">
                    <strong>Alleged</strong>:
                    <span style="${entityStyle}">{{ incident.developers }}</span> developed an AI system deployed by
                    <span style="${entityStyle}">{{ incident.deployers }}</span> which harmed 
                    <span style="${entityStyle}">{{ incident.entitiesHarmed }}</span>.
                  </p>
                </div>
              </li>
            {% endfor %}
          </ul>
        {% else %}
          <p>No new incidents were reported this week.</p>
        {% endif %}
      </div>

      {% if newBlogPosts %}
        <div style="${sectionStyle}">
          <h2>New Blog Posts</h2>
          <ul>
            {% for blogPost in newBlogPosts %}
              <div style="${incidentStyle}">
                <h1 style="font-size: 100%; margin-top: 0px;">
                  {{ blogPost.title }}
                </h1>

                <p style="font-size: 85%;">{{ blogPost.date }}</p>

                <p style="font-size: 85%;">
                  {{ blogPost.description }}
                </p>
              </div>
            {% endfor %}
          </ul>
        </div>
      {% endif %}

      {% if updates %}
        <div style="${sectionStyle}">
          <h2>New Features & Updates</h2>
          <ul>
            {% for update in updates %}
              <li style="list-style-type: none;">{{update.text}}</li>
            {% endfor %}
          </ul>
        </div>
      {% endif %}

      <p style="margin-bottom: 32px">
        You can manage your email subscriptions from
        <a href="https://incidentdatabase.ai/account/">your account page</a>.
      </p>

      <p>
        Sincerely,<br>
        Responsible AI Collaborative
      </p>
    `,
    { title: 'Weekly AI Incident Briefing' }
  );
};

export default getEmailTemplate();
