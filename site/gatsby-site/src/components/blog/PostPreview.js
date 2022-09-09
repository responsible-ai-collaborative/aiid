import React from 'react';
import { GatsbyImage as Img } from 'gatsby-plugin-image';
import { format } from 'date-fns';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { Trans } from 'react-i18next';

function PostPreview({ post }) {
  return (
    <>
      <div className="flex flex-col w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <LocalizedLink to={post.frontmatter.slug} className="text-primary-blue max-w-full">
          <Img
            alt="post-image"
            className="img-fluid h-full w-full max-w-full max-h-240 rounded-t-lg"
            imgStyle={{ transition: '0.5s all ease-in-out' }}
            imgClassName="hover:scale-110 object-cover"
            image={post.frontmatter.image.childImageSharp.gatsbyImageData}
          />
        </LocalizedLink>
        <div className="p-5">
          <LocalizedLink to={post.frontmatter.slug} className="">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white relative block hover:text-primary-blue">
              {post.fields.title}
            </h5>
          </LocalizedLink>
          <p className="text-muted-gray text-sm">By {post.frontmatter.author}</p>
          <p className="text-sm text-muted-gray">
            {format(new Date(post.frontmatter.date), 'MMM d, yyyy')}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.excerpt}... </p>
          <div className="flex justify-end">
            <a
              href={post.frontmatter.slug}
              className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <Trans>Read more</Trans>
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
      </div>
    </>
  );
}

export default PostPreview;
