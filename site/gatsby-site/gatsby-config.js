require('dotenv').config();
const md5 = require('md5');

const path = require(`path`);

const cloudinary = require('cloudinary').v2;

const config = require('./config');

cloudinary.config({ cloud_name: config.cloudinary.cloudName });

const plugins = [
  {
    resolve: `gatsby-plugin-netlify`,
    options: {
      mergeCachingHeaders: false,
    },
  },
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
            sizeByPixelDensity: true,
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
      trackingIds: [config.gatsby.gaTrackingId],
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
      ],
      connectionString: config.mongodb.connectionString,
      extraParams: {
        replicaSet: config.mongodb.replicaSet,
      },
    },
  },
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
      extraParams: {
        replicaSet: config.mongodb.replicaSet,
      },
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
            return allMongodbAiidprodReports.edges.map((edge) => {
              const publicID = edge.node.cloudinary_id
                ? edge.node.cloudinary_id
                : `legacy/${md5(edge.node.media_url)}`;

              const report_number = edge.node.report_number;

              const matchingIncidents = allMongodbAiidprodIncidents.edges.find((incident) => {
                return incident.node.reports.find((report) => {
                  return report === report_number;
                });
              });

              let incident_id = '';

              if (matchingIncidents) {
                incident_id = matchingIncidents.node.incident_id;
              }

              const dateSubmitted = new Date(edge.node.date_submitted).toUTCString();

              const description = `${edge.node.text.slice(0, 240)} ... ${
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
                  id
                  media_url
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
                  reports
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
    resolve: `gatsby-source-s3`,
    options: {
      aws: {
        // This AWS IAM user has been provisioned no permissions, but the plugin requires a user to
        // get a listing of the public S3 bucket. User: backupindexpublic
        accessKeyId: 'AKIA25BP4AERUFDGAJUJ',
        secretAccessKeyId: 'backupindexpublic',
        secretAccessKey: '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',
      },
      buckets: ['aiid-backups-public'],
      // expiration: 120,
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
        ],
        debug: process.env.GATSBY_I18N_DEBUG,
        nsSeparator: false,
        keySeparator: '.',
      },
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
  trailingSlash: `always`,
  flags: {
    DEV_SSR: true,
  },
};
