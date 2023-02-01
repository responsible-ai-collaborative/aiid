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
  'gatsby-plugin-styled-components',
  'gatsby-plugin-sitemap',
  `gatsby-plugin-image`,
  'gatsby-plugin-sharp',
  `gatsby-transformer-sharp`,
  'gatsby-plugin-react-helmet',
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
    resolve: `gatsby-plugin-gtag`,
    options: {
      // your google analytics tracking id
      trackingId: config.gatsby.gaTrackingId,
      // Puts tracking script in the head instead of the body
      head: true,
      // enable ip anonymization
      anonymize: false,
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
          serialize: ({ query: { allMongodbAiidprodReports } }) => {
            return allMongodbAiidprodReports.edges.map((edge) => {
              const publicID = edge.node.cloudinary_id
                ? edge.node.cloudinary_id
                : `legacy/${md5(edge.node.image_url)}`;

              return Object.assign({}, edge.node.frontmatter, {
                title: edge.node.title,
                url: edge.node.url,
                link: edge.node.url,
                description: edge.node.description,
                guid: edge.node.id,
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
          query: `
            {
              allMongodbAiidprodReports(sort: {fields: date_submitted, order: DESC}, limit: 100) {
                totalCount
                edges {
                  node {
                    title
                    url
                    description
                    id
                    image_url
                    cloudinary_id
                  }
                }
              }
            }
          `,
          output: '/rss.xml',
          title: 'AI Incident Database RSS Feed',
        },
      ],
    },
  },
  'gatsby-plugin-use-query-params',
  {
    resolve: `@robinmetral/gatsby-source-s3`,
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
        ],
        debug: process.env.GATSBY_I18N_DEBUG,
        nsSeparator: false,
        keySeparator: '.',
      },
    },
  },
  'gatsby-plugin-postcss',
  'gatsby-plugin-sass',
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
};
