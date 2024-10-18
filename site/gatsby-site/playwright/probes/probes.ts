import { test } from '../utils';
import { testUrls } from '../e2e/pages-tests';
import config from '../../config';

// This array defines the probe tests that are run
// Each test has a string description, string baseUrl value, and array of string paths
// that are sent to testUrls(baseUrl,paths)
[
	// prod urls
	// baseUrl: null means use value of config.gatsby.siteUrl
	{ 
		title: 'Probing prod home page', 
		// baseUrl: null means use value of config.gatsby.siteUrl
		baseUrl: null, 
		// home page
		paths: ['/']
	},
	{ 
		title: 'Probing prod submitted page', 
		// baseUrl: null means use value of config.gatsby.siteUrl
		baseUrl: null, 
		// submitted
		paths: ['/apps/submitted/']
	},
	{ 
		title: 'Probing prod newsdigest page', 
		// baseUrl: null means use value of config.gatsby.siteUrl
		baseUrl: null, 
		// newsdigest
		paths: ['/apps/newsdigest/']
	},
	{ 
		title: 'Probing staging checklist page', 
		// baseUrl: null means use value of config.gatsby.siteUrl
		baseUrl: 'https://staging-aiid.netlify.app', 
		paths: ['/apps/checklist/']
	}
].forEach(({title, baseUrl, paths}) => {
	test(title, () => testUrls(baseUrl, paths));
});