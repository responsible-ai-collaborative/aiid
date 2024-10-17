import { test } from '../utils';
import { testUrls } from '../e2e/pages-tests';
import config from '../../config';

// This array defines the probe tests that are run
// Each test has a string description, string baseUrl value, and array of string paths
// that are sent to testUrls(baseUrl,paths)
[
	// prod paths
	// baseUrl: null means use value of config.gatsby.siteUrl
	{ 
		title: 'Probing prod server paths', 
		// baseUrl: null means use value of config.gatsby.siteUrl
		baseUrl: null, 
		paths: [
			// home page
	    	'/',
			// submitted
	    	'/apps/submitted/',
			// newsdigest
	    	'/apps/newsdigest/',
	  	] 
	},
	{ 
		title: 'Probing staging server paths', 
		// baseUrl: null means use value of config.gatsby.siteUrl
		baseUrl: 'https://staging-aiid.netlify.app', 
		paths: [
			// checklist
			'/apps/checklist/'
		]
	}
].forEach(({title, baseUrl, paths}) => {
	test(title, () => testUrls(baseUrl, paths));
});

