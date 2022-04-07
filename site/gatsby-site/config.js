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
    graphqlApiKey: process.env.REALM_GRAPHQL_API_KEY,
  },
  header: {
    logo: '/logos/White_Transparent_AIID_short.png',
    logoMobile: '/White_Transparent_AIID.png',
    logoLink: '/',
    title: ' AI Incident Database',
    githubUrl: 'https://github.com/responsible-ai-collaborative/aiid',
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
    navConfig: [
      { label: 'welcome', url: '/', items: [], title: 'Welcome to the AIID' },
      { label: 'about', url: '/about', items: [], title: 'About' },
      { label: 'blog', url: '/blog', items: [], title: 'AIID Blog' },
      {
        label: 'about_apps',
        url: '/about_apps',
        items: [
          { label: 'discover', url: '/apps/discover', items: [], title: 'Discover Incidents' },
          { label: 'submit', url: '/apps/submit', items: [], title: 'Submit Incident Reports' },
          {
            label: 'all-incidents',
            url: '/summaries/incidents',
            items: [],
            title: 'All Incidents in List Form',
          },
          {
            label: 'leaderboard',
            url: '/summaries/leaderboard',
            items: [],
            title: 'Submission Leaderboard',
          },
          {
            label: 'classifications',
            url: '/apps/classifications',
            items: [],
            title: 'Classifications View',
          },
          { label: 'flagged', url: '/summaries/flagged', items: [], title: 'Flagged Incidents' },
          { label: 'wordcounts', url: '/summaries/wordcounts', items: [], title: 'Word Counts' },
        ],
        title: 'Database Apps',
      },
      {
        label: 'research',
        url: '/research',
        items: [
          {
            label: '1-criteria',
            url: '/research/1-criteria',
            items: [],
            title: 'Incident Report Acceptance Criteria',
          },
          { label: '2-roadmap', url: '/research/2-roadmap', items: [], title: 'Database Roadmap' },
          {
            label: '3-history',
            url: '/research/3-history',
            items: [],
            title: 'Initial Collection Methodology',
          },
        ],
        title: 'Researcher Guide',
      },
      { label: 'taxonomies', url: '/taxonomies', items: [], title: 'Taxonomies' },
      { label: 'contact', url: '/contact', items: [], title: 'Contact and Follow' },
    ],
    links: [
      { text: 'Launch Announcement', link: 'https://partnershiponai.org/aiincidentdatabase/' },
    ],
    frontline: true,
    ignoreIndex: false,
    title: '',
  },
  siteMetadata: {
    title: 'Artificial Intelligence Incident Database',
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
