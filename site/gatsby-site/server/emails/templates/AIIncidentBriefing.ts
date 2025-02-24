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
        {{#if newIncidents}}
          {{#each newIncidents}}
            <p>
              <a href="{{this.url}}">Incident {{this.id}}: {{this.title}}</a>
              <br>
              <span style="font-size: 85%;">{{this.date}}</span>
            </p>
          {{/each}}
        {{else}}
          <p>No new incidents were reported this week.</p>
        {{/if}}
      </div>

      <div style="${sectionStyle}">
        <h2>New Blog Posts</h2>
        {{#if newBlogPosts}}
          {{#each newBlogPosts}}
            <p>
              <a href="{{this.url}}">{{this.title}}</a>
              <br>
              <span style="font-size: 85%;">{{this.date}}</span>
            </p>
          {{/each}}
        {{else}}
          <p>No new blog posts were published this week.</p>
        {{/if}}
      </div>

      <div style="${sectionStyle}">
        <h2>New Features & Updates</h2>
        {{#if newFeatures}}
          <ul>
            {{#each newFeatures}}
              <li>{{this}}</li>
            {{/each}}
          </ul>
        {{else}}
          <p>No major updates this week.</p>
        {{/if}}
      </div>

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
