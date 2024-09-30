import { test } from '../utils';
import { testUrls } from './pages-tests';
import config from '../../config';

test.describe('Probes 1 - No login, uses baseUrl == config.gatsby.siteUrl, submitted+newsdigest', () => {
	// uses 'config.gatsby.baseUrl'
	const baseUrl = config.gatsby.siteUrl;
	const paths = [
    	'/',
    	'/apps/submitted/',
    	'/apps/newsdigest/',
  	];
  	// testUrls for each baseUrl/path combination
  	testUrls(baseUrl, paths);
});

test.describe('Probes 2 - No login, uses baseUrl == https://staging-aiid.netlify.app, checklist', () => {
	// Perhaps this should be moved to a config variable?
	const baseUrl = "https://staging-aiid.netlify.app"
	const paths = [
		'/apps/checklist/'
	];
	// testUrls for each baseUrl/path combination
	testUrls(baseUrl, paths)
});