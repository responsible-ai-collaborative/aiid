import React from 'react';
import { GatsbyImage as Img } from 'gatsby-plugin-image';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { Trans } from 'react-i18next';
import DateLabel from 'components/ui/DateLabel';

function PrismicPostPreview({ post, latestPost = false }) {
  return (
    <>
      <div className="flex flex-col w-full h-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <LocalizedLink
          to={`/blog/${post.data.slug}`}
          className="hover:no-underline text-primary-blue max-w-full"
        >
          <Img
            alt="post-image"
            className="img-fluid w-full max-w-full max-h-240 h-[240px] rounded-t-lg"
            imgStyle={{ transition: '0.5s all ease-in-out' }}
            imgClassName="hover:scale-110 object-cover"
            image={post.data.image.gatsbyImageData}
          />
        </LocalizedLink>
        <div className="p-6">
          <LocalizedLink to={`/blog/${post.data.slug}`} className="hover:no-underline">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white relative block hover:text-primary-blue">
              {post.data.title.text}
              {latestPost && (
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold whitespace-nowrap ml-2 px-1.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900">
                  <Trans ns="landing">Latest Blog Post</Trans>
                </span>
              )}
            </h5>
          </LocalizedLink>
          <p className="text-muted-gray text-sm">By {post.data.author}</p>
          <p className="text-sm text-muted-gray">
            <DateLabel date={new Date(post.data.date)} />
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {post.data.content.text.slice(0, 140)}...{' '}
          </p>
        </div>
        <div className="flex items-end flex-1 p-6">
          <a
            href={`/blog/${post.data.slug}`}
            className="hover:no-underline inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <Trans>Read More</Trans>
            <svg
              aria-hidden="true"
              className="ml-2 -mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}

export default PrismicPostPreview;
