import React from 'react';
import { GatsbyImage as Img } from 'gatsby-plugin-image';
import { format } from 'date-fns';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { Trans } from 'react-i18next';

function PostPreview({ post }) {
  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-max-w-sm tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-shadow-md tw-dark:bg-gray-800 tw-dark:border-gray-700">
      <LocalizedLink to={post.frontmatter.slug} className="tw-text-primary-blue tw-max-w-full">
        <Img
          alt="post-image"
          className="img-fluid tw-rounded-start tw-h-full  tw-max-w-full tw-max-h-240 tw-rounded-t-lg"
          imgStyle={{ transition: '0.5s all ease-in-out' }}
          imgClassName="hover:tw-scale-110 tw-object-cover"
          image={post.frontmatter.image.childImageSharp.gatsbyImageData}
        />
      </LocalizedLink>
      <div className="tw-p-5 tw-flex tw-flex-col tw-justify-between tw-flex-1">
        <h5 className="tw-mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 tw-dark:text-white">
          {post.fields.title}
        </h5>
        <div className="tw-font-medium">
          {format(new Date(post.frontmatter.date), 'MMM d, yyyy')}
        </div>
        <p className="tw-mb-3 tw-font-normal tw-text-gray-700 tw-dark:text-gray-400">
          {post.excerpt}...{' '}
          <LocalizedLink to={post.frontmatter.slug}>
            <Trans>(Read More)</Trans>
          </LocalizedLink>
        </p>
        <div className="tw-mt-4 tw-mb-4">
          <small className="tw-text-muted-gray tw-text-sm">By {post.frontmatter.author}</small>
        </div>
        <LocalizedLink
          to={post.frontmatter.slug}
          className="tw-inline-flex tw-items-center tw-py-2 tw-px-3 tw-text-sm tw-font-medium tw-text-center tw-text-white tw-bg-blue-700 tw-rounded-lg tw-hover:bg-blue-800 tw-focus:ring-4 tw-focus:outline-none tw-focus:ring-blue-300 tw-dark:bg-blue-600 tw-dark:hover:bg-blue-700 tw-dark:focus:ring-blue-800 tw-self-start"
        >
          Read more
          <svg
            aria-hidden="true"
            className="tw-ml-2 -tw-mr-1 tw-w-4 tw-h-4"
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
        </LocalizedLink>
      </div>
    </div>
  );
}

export default PostPreview;
