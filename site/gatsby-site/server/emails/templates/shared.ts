const ignoreWhitespace = (s: string): string => s.replace(/\s+/g, ' ').trim();

// Wraps email content with shared header, footer...
const insertContent= (content: string, variables: any): string  => {
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
				<div style="padding: 32px 8px;">
          ${content}
				</div>
			</div>
		</body>
	</html>
  `.replace(/\n\t/g, '\n').trim();
}

// These styles will be used across multiple email templates,
// so they get defined outside the getTemplate function.
const bodyStyle: string = ignoreWhitespace(`
  font-family: karla, sans-serif; 
  padding: 16px;
`);

const wrapperStyle: string = ignoreWhitespace(`
  max-width: 800px;
  line-height: 1.5;
  margin: auto;
`);

const headerStyle: string = ignoreWhitespace(`
  padding: 16px;
  height: 100px;
  text-align: center;
  margin-bottom: 16px;
`);

const headerTitleStyle: string = ignoreWhitespace(`
  line-height: 70px;
  vertical-align: top;
  font-size: 125%;
  font-weight: 400;
`);

const mainActionLink: string = ignoreWhitespace(`
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

export { 
  ignoreWhitespace,
  insertContent,
  bodyStyle,
  wrapperStyle,
  headerStyle,
  headerTitleStyle,
  mainActionLink,
};
