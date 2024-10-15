import { test } from '../../utils';
import { testUrls } from '../pages-tests';
import config from '../../../config';

// [baseUrl, [paths under base url] ]
const urls1 = [
	// prod
	// null == config.gatsby.siteUrl value from config is used
	[null, 
		[
			// home page
    		'/',
			// submitted
    		'/apps/submitted/',
			// newsdigest
    		'/apps/newsdigest/',
  		]
	],
	// staging
	["https://staging-aiid.netlify.app",
		[
			// checklist
			'/apps/checklist/'
		]
	]
];

// run test probe for each url in urls1 defined above
test.describe('Probes - No login, uses const urls1 from probes.ts', () => {
  	urls1.forEach((url) -> testUrls(url[0], url[1]);
});

