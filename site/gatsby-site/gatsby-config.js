require('dotenv').config();
const md5 = require('md5');

const path = require(`path`);

const cloudinary = require('cloudinary').v2;

const queries = require('./src/utils/algolia');

const config = require('./config');

cloudinary.config({ cloud_name: config.cloudinary.cloudName });

const plugins = [
  {
    resolve: `gatsby-plugin-layout`,
    options: {
      component: require.resolve(`./wrap-with-provider`),
    },
  },
  {
    resolve: `gatsby-plugin-netlify`,
    options: {
      headers: {},
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
  `gatsby-transformer-sharp`,
  'gatsby-plugin-sharp',
  'gatsby-plugin-emotion',
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
      collection: ['incidents', 'submissions', 'quickadd', 'duplicates', 'taxa', 'classifications'],
      connectionString: config.mongodb.connectionString,
      extraParams: {
        replicaSet: config.mongodb.replicaSet,
        ssl: true,
        authSource: 'admin',
        retryWrites: true,
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
          serialize: ({ query: { allMongodbAiidprodIncidents } }) => {
            return allMongodbAiidprodIncidents.edges.map((edge) => {
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
              allMongodbAiidprodIncidents(sort: {fields: date_submitted, order: DESC}, limit: 100) {
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
];

// check and add algolia
if (
  config.header.search &&
  config.header.search.enabled &&
  config.header.search.algoliaAppId &&
  config.header.search.algoliaAdminKey
) {
  plugins.push({
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: config.header.search.algoliaAppId, // algolia application id
      apiKey: config.header.search.algoliaAdminKey, // algolia admin key to index
      queries,
      chunkSize: 10000, // default: 1000
    },
  });
}
// check and add pwa functionality
if (config.pwa && config.pwa.enabled && config.pwa.manifest) {
  plugins.push({
    resolve: `gatsby-plugin-manifest`,
    options: { ...config.pwa.manifest },
  });
  plugins.push({
    resolve: 'gatsby-plugin-offline',
    options: {
      appendScript: require.resolve(`./src/custom-sw-code.js`),
    },
  });
} else {
  plugins.push('gatsby-plugin-remove-serviceworker');
}

// check and remove trailing slash
if (config.gatsby && !config.gatsby.trailingSlash) {
  plugins.push('gatsby-plugin-remove-trailing-slashes');
}

plugins.push(`gatsby-plugin-client-side-redirect`);

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
    }, // backwards compatible
    headerTitle: config.header.title,
    githubUrl: config.header.githubUrl,
    helpUrl: config.header.helpUrl,
    tweetText: config.header.tweetText,
    headerLinks: config.header.links,
    siteUrl: config.gatsby.siteUrl,
  },
  plugins: plugins,
};
