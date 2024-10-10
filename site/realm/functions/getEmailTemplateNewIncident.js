
exports = function () {
  
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
  // Template variables wrapped in {{ }} are handled per-email by Sendgrid,
  // see site/realm/functions/sendEmail.js.
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


// ====================================================================
// Everything below here is to be shared between all templates.
// ====================================================================
const ignoreWhitespace = (s) => s.replace(/\s+/g, ' ').trim();

// Wraps email content with shared header, footer...
const insertContent = (content, variables) => {
	return `
	<!doctype html>
	<html>
		<head>
			<meta charset="utf-8"/>
			<title>${variables.title}</title>
      <style>
        /* These media queries may not be supported,
         * so we have to ensure it works
         * with the default color schemes too.
         */
        @media (prefers-color-scheme: dark) {
          body { color: white   ; background: #212b39 ; }
          a    { color: #3abef8 ;                       }
        }
        @media (prefers-color-scheme: light) {
          body { color: black   ; background: white   ; }
          a    { color: #2764eb ;                       }
        }
      </style>
		</head>
		<body style="${bodyStyle}">
			<div style="${wrapperStyle}">
				<div style="${headerStyle}">
					<img
						alt="AIID"
						src="https://res.cloudinary.com/pai/image/upload/v1727286210/Black_Glowing_AIID_400x218_jqcgpb.png"
						height="100"
					/>
					<div style="${headerTitleStyle}">
						AI INCIDENT DATABASE
					</div>
				</div>
				<div style="padding: 32px;">
          ${content}
				</div>
			</div>
		</body>
	</html>
  `.replace(/\n\t/g, '\n').trim();
}

// These styles will be used across multiple email templates,
// so they get defined outside the getTemplate function.
const bodyStyle = ignoreWhitespace(`
  font-family: karla; 
  padding: 16px;
`);

const wrapperStyle = ignoreWhitespace(`
  max-width: 800px;
  line-height: 1.5;
  margin: auto;
`);

const headerStyle = ignoreWhitespace(`
  padding: 16px;
  height: 100px;
  text-align: center;
  margin-bottom: 16px;
`);

const headerTitleStyle = ignoreWhitespace(`
  line-height: 70px;
  vertical-align: top;
  font-size: 125%;
  font-weight: 400;
`);

const mainActionLink = ignoreWhitespace(`
  display: block;
  margin: 16px;
  padding: 32px; 
  text-align: center;
  border-radius: 16px;
  background-color: #1c57db;
  color: white;
  text-decoration: none;
  font-size: 120%;
`);

module.exports = exports;
