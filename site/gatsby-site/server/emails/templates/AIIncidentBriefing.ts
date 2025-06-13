import {
  ignoreWhitespace,
  insertContent,
} from './shared';

const getEmailTemplate = () => {
  const sectionStyle = ignoreWhitespace(`
    padding: 24px;
    border-bottom: 1px solid #ccc;
    font-size: 90%;
  `);

  const incidentStyle = ignoreWhitespace(`
    padding: 32px;
    font-size: 90%;
  `);

  const imageStyle = ignoreWhitespace(`
    display: block;
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    border: 0;
    margin: 0 auto;
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
        This is your AI Incident Briefing, summarizing the latest activity on the AI Incident Database.
        Stay informed about new incidents, reports, blog posts, and platform updates.
      </p>

      <div style="${sectionStyle}">
        <h2>New Incidents & Reports</h2>
        {% if newIncidents|length == 0 %}
          <p>No new incidents or reports.</p>
        {% else %}
          {% for incident in newIncidents %}
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px; max-width: 600px;">
              <tr>
                <td style="padding-bottom: 12px;" align="center">
                  {% if incident.reportImageUrl %}
                    <img 
                      src="{{ incident.reportImageUrl }}" 
                      alt="Incident image" 
                      style="${imageStyle}"
                    >
                  {% endif %}
                </td>
              </tr>
              <tr>
                <td>
                  <h1 style="font-size: 100%; margin-top: 0px;">
                    <a href="{{ incident.url }}">{{ incident.title }}</a>
                  </h1>
                  <p style="font-size: 85%;">{{ incident.date }}</p>
                  <p style="font-size: 85%;">{{ incident.description }}</p>
                  <p style="margin-bottom: 0px; line-height: 1.75%;">
                    <strong>Alleged</strong>:
                    <span style="${entityStyle}">{{ incident.developers }}</span> developed an AI system deployed by
                    <span style="${entityStyle}">{{ incident.deployers }}</span> which harmed 
                    <span style="${entityStyle}">{{ incident.entitiesHarmed }}</span>.
                  </p>
                </td>
              </tr>
            </table>
          {% endfor %}
        {% endif %}
      </div>

      {% if newBlogPosts %}
        <div style="${sectionStyle}">
          <h2>New Blog Posts</h2>
          {% for blogPost in newBlogPosts %}
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px; max-width: 600px;">
              <tr>
                <td style="padding-bottom: 12px;" align="center">
                  {% if blogPost.image %}
                    <img 
                      src="{{ blogPost.image }}" 
                      alt="Blog Post Image" 
                      style="${imageStyle}"
                    >
                  {% endif %}
                </td>
              </tr>
              <tr>
                <td>
                  <h1 style="font-size: 100%; margin-top: 0px;">
                    <a href="{{ blogPost.url }}">{{ blogPost.title }}</a>
                  </h1>
                  <p style="font-size: 85%;">{{ blogPost.author }}</p>
                  <p style="font-size: 85%;">{{ blogPost.date }}</p>
                  <p style="font-size: 85%;">{{ blogPost.description }}</p>
                </td>
              </tr>
            </table>
          {% endfor %}
        </div>
      {% endif %}

      {% if updates %}
        <div style="${sectionStyle}">
          <h2>New Features & Updates</h2>
          {% for update in updates %}
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px; max-width: 600px;">
              <tr>
                <td style="padding-bottom: 12px;" align="center">
                  {% if update.image %}
                    <img 
                      src="{{ update.image }}" 
                      alt="Update image" 
                      style="${imageStyle}"
                    >
                  {% endif %}
                </td>
              </tr>
              <tr>
                <td>
                  <h1 style="font-size: 100%; margin-top: 0px;">
                    {{ update.title }}
                  </h1>
                  <p style="font-size: 85%;">{{ update.description }}</p>
                </td>
              </tr>
            </table>
          {% endfor %}
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
    { title: 'AI Incident Briefing' }
  );
};

export default getEmailTemplate();
