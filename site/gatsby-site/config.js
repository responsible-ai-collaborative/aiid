const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://incidentdatabase.ai',
    gaTrackingId: 'UA-23867277-2',
    trailingSlash: false,
  },
  realm: {
    review_db: {
      realm_app_id: process.env.GATSBY_REALM_APP_ID,
      db_service: 'mongodb-atlas',
      db_name: 'aiidprod',
      db_collection: 'submissions',
    },
    production_db: {
      realm_app_id: process.env.GATSBY_REALM_APP_ID,
      db_service: 'mongodb-atlas',
      db_name: 'aiidprod',
      db_collection: 'incidents',
    },
  },
  header: {
    logo: '/partership-on-ai-logo-1up.png',
    logoMobile: '/partership-on-ai-logo-mobile.png',
    logoLink: '/',
    title: ' AI Incident Database',
    githubUrl: 'https://github.com/PartnershipOnAI/aiid',
    helpUrl: '',
    tweetText: '',
    social: `<li>
		    <a href="https://twitter.com/IncidentsDB" target="_blank" rel="noopener">
		      <div class="twitterBtn">
		        <img src='/twitter-brands-block.svg' alt={'Twitter'}/>
		      </div>
		    </a>
		  </li>`,
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID || 'JD5JCVZEVS',
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY || 'c5e99d93261645721a1765fe4414389c',
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: ['/welcome', '/about', '/research', '/summaries', '/about_apps', '/contact'],
    collapsedNav: [
      //'/codeblock', // add trailing slash if enabled above
    ],
    links: [{ text: 'Partnership on AI Home', link: 'https://partnershiponai.org' }],
    frontline: true,
    ignoreIndex: false,
    title: '',
  },
  siteMetadata: {
    title: 'Artificial Intelligence Incident Database | Partnership on AI',
    description: 'a collection of intelligent system harms in the real world ',
    ogImage: null,
    docsLocation: '/',
    favicon: '/favicon.png',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'The Artificial Intelligence Incident Database',
      short_name: 'AIID',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
  cloudinary: {
    cloudName: 'pai',
  },
  mongodb: {
    connectionString: process.env.MONGODB_CONNECTION_STRING,
    replicaSet: process.env.MONGODB_REPLICA_SET,
    translationsConnectionString: process.env.MONGODB_TRANSLATIONS_CONNECTION_STRING,
  },
  google: {
    translateApikey: process.env.GOOGLE_TRANSLATE_API_KEY,
    availableLanguages: process.env.GATSBY_AVAILABLE_LANGUAGES || 'en',
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
};

module.exports = config;
