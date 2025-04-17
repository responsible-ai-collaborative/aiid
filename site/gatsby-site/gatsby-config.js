require('dotenv').config();
const md5 = require('md5');

const path = require(`path`);

const cloudinary = require('cloudinary').v2;

const config = require('./config');

cloudinary.config({ cloud_name: config.cloudinary.cloudName });

const adapter = require('gatsby-adapter-netlify').default;

let googleTrackingIds = [];

// TODO: Remove this once we have a new env variable ENVIRONMENT to check against
if (process.env.SITE_URL === 'https://incidentdatabase.ai') {
  googleTrackingIds.push(config.gatsby.gaTrackingId);
}

const plugins = [
  'layout',
  {
    resolve: `gatsby-plugin-catch-links`,
    options: {
      excludePattern: /(\/discover\/)/,
    },
  },
  'gatsby-plugin-sitemap',
  `gatsby-plugin-image`,
  'gatsby-plugin-sharp',
  `gatsby-transformer-sharp`,
  'gatsby-plugin-react-helmet',
  {
    resolve: 'gatsby-plugin-mdx',
    options: {
      gatsbyRemarkPlugins: [
        {
          resolve: 'gatsby-remark-images',
          options: {
            maxWidth: 1035,
          },
        },
        {
          resolve: 'gatsby-remark-copy-linked-files',
        },
      ],
      extensions: ['.mdx', '.md'],
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'docs',
      path: `${__dirname}/content/`,
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'blog',
      path: `${__dirname}/blog/`,
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'images',
      path: path.join(__dirname, `src`, `images`),
    },
  },
  {
    resolve: `gatsby-plugin-google-gtag`,
    options: {
      trackingIds: googleTrackingIds,
    },
  },
  {
    resolve: 'gatsby-source-mongodb',
    options: {
      dbName: 'aiidprod',
      collection: [
        'incidents',
        'submissions',
        'quickadd',
        'duplicates',
        'taxa',
        'classifications',
        'reports',
        'entities',
        'entity_relationships',
      ],
      connectionString: config.mongodb.connectionString,
      ...(config.mongodb.replicaSet
        ? { extraParams: { replicaSet: config.mongodb.replicaSet } }
        : {}),
    },
  },
  // TODO: Remove the following source once all reports are migrated to the new schema
  {
    resolve: 'gatsby-source-mongodb',
    options: {
      dbName: 'translations',
      collection: ['reports'].reduce(
        (collections, name) => [
          ...collections,
          ...config.i18n.availableLanguages.map((lang) => `${name}_${lang}`),
        ],
        []
      ),
      connectionString: config.mongodb.connectionString,
      ...(config.mongodb.replicaSet
        ? { extraParams: { replicaSet: config.mongodb.replicaSet } }
        : {}),
    },
  },
  {
    resolve: 'gatsby-source-mongodb',
    options: {
      dbName: 'translations',
      collection: ['reports', 'incidents'],
      connectionString: config.mongodb.connectionString,
      extraParams: {
        replicaSet: config.mongodb.replicaSet,
      },
    },
  },
  {
    resolve: 'gatsby-source-mongodb',
    options: {
      dbName: 'customData',
      collection: ['users'],
      connectionString: config.mongodb.connectionString,
    },
  },
  {
    resolve: 'gatsby-plugin-feed',
    options: {
      query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
      feeds: [
        {
          serialize: ({ query: { allMongodbAiidprodReports, allMongodbAiidprodIncidents } }) => {
            if (allMongodbAiidprodReports.edges.length === 0) {
              return [{ title: 'There are no reports yet.' }];
            }

            return allMongodbAiidprodReports.edges.map((edge) => {
              const publicID = edge.node.cloudinary_id
                ? edge.node.cloudinary_id
                : `legacy/${md5(edge.node.image_url)}`;

              const report_number = edge.node.report_number;

              const matchingIncidents = allMongodbAiidprodIncidents.edges.find((incident) => {
                return incident.node.reports.find((report) => {
                  return report.report_number === report_number;
                });
              });

              let incident_id = '';

              if (matchingIncidents) {
                incident_id = matchingIncidents.node.incident_id;
              }

              const dateSubmitted = new Date(edge.node.date_submitted).toUTCString();

              const description = `${edge.node.plain_text.slice(0, 240)} ... ${
                matchingIncidents
                  ? '(https://incidentdatabase.ai/cite/' + incident_id + '#' + report_number + ')'
                  : '(report_number: ' + report_number + ')'
              }`;

              return Object.assign({}, edge.node.frontmatter, {
                title: edge.node.title,
                url: edge.node.url,
                link: edge.node.url,
                description: description,
                guid: edge.node.id,
                date: dateSubmitted,
                enclosure: {
                  url: cloudinary.url(publicID, {
                    secure: true,
                    width: 800,
                    default_image: 'fallback.jpg',
                  }),
                  type: 'image/jpeg',
                },
              });
            });
          },
          query: `{
            allMongodbAiidprodReports(sort: {date_submitted: DESC}, limit: 100) {
              totalCount
              edges {
                node {
                  title
                  url
                  text
                  plain_text
                  id
                  image_url
                  cloudinary_id
                  date_submitted
                  report_number
                }
              }
            }
            allMongodbAiidprodIncidents(sort: {date: DESC}) {
              totalCount
              edges {
                node {
                  incident_id
                  reports { 
                    report_number
                  }
                }
              }
            }
          }`,
          output: '/rss.xml',
          title: 'AI Incident Database RSS Feed',
        },
      ],
    },
  },
  {
    resolve: `gatsby-theme-i18n`,
    options: {
      defaultLang: config.i18n.defaultLanguage,
      configPath: require.resolve(`./i18n/config.json`),
      locales: config.i18n.availableLanguages.join(' '),
    },
  },
  {
    resolve: `gatsby-theme-i18n-react-i18next`,
    options: {
      locales: `./i18n/locales`,
      i18nextOptions: {
        ns: [
          'translation',
          'actions',
          'landing',
          'submit',
          'validation',
          'submitted',
          'login',
          'popovers',
          'wordcount',
          'leaderboard',
          'entities',
          'account',
          'variants',
          'footer',
          'sponsors',
          'reports',
          'incidents',
          'auth',
        ],
        debug: process.env.GATSBY_I18N_DEBUG,
        nsSeparator: false,
        keySeparator: '.',
      },
    },
  },
  {
    resolve: 'gatsby-source-prismic',
    options: {
      repositoryName: process.env.GATSBY_PRISMIC_REPO_NAME,
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
      schemas: {
        blog: require('./custom_types/blog.json'),
        doc: require('./custom_types/doc.json'),
        footer: require('./custom_types/footer.json'),
        sidebar: require('./custom_types/sidebar.json'),
        sidebar_item: require('./custom_types/sidebar_item.json'),
        sponsor: require('./custom_types/sponsor.json'),
      },
      routes: [
        {
          type: 'blog',
          path: '/blog/:uid',
        },
      ],
      lang: '*',
    },
  },
];

module.exports = {
  pathPrefix: config.gatsby.pathPrefix,
  siteMetadata: {
    title: config.siteMetadata.title,
    description: config.siteMetadata.description,
    docsLocation: config.siteMetadata.docsLocation,
    ogImage: config.siteMetadata.ogImage,
    favicon: config.siteMetadata.favicon,
    logo: {
      link: config.header.logoLink ? config.header.logoLink : '/',
      image: config.header.logo,
      mobile: config.header.logoMobile,
    }, // backwards compatible
    headerTitle: config.header.title,
    githubUrl: config.header.githubUrl,
    facebookUrl: config.header.facebookUrl,
    linkedInUrl: config.header.linkedInUrl,
    helpUrl: config.header.helpUrl,
    tweetText: config.header.tweetText,
    headerLinks: config.header.links,
    siteUrl: config.gatsby.siteUrl,
  },
  plugins: plugins,
  adapter: adapter({
    excludeDatastoreFromEngineFunction: true,
  }),
  trailingSlash: `always`,
  flags: {
    DEV_SSR: true,
  },
};
