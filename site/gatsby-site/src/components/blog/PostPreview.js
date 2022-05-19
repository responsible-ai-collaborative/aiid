import React from 'react';
import Img from 'gatsby-image';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { format } from 'date-fns';

const StyledImg = styled(Img)`
  width: 100%;
`;

function PostPreview({ post }) {
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden lg:w-[46%] w-[100%]">
      <div className="flex-shrink-0">
        <Link to={post.fields.slug}>
          <StyledImg
            className="h-56 w-full object-cover"
            fluid={post.frontmatter.image.childImageSharp.fluid}
          />
        </Link>
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <a href={post.href} className="block mt-2">
            <p className="text-xl font-semibold text-gray-900">
              <Link to={post.fields.slug}>{post.fields.title}</Link>
            </p>
            <p className="mt-3 text-base text-gray-700 font-bold">
              {format(new Date(post.frontmatter.date), 'MMM d, yyyy')}
            </p>
            <p className="mt-2 text-base text-gray-500">
              {' '}
              {post.excerpt}... <Link to={post.fields.slug}>(Read More)</Link>
            </p>
            <p className="mt-3">
              <small className="text-base text-gray-500">By {post.frontmatter.author}</small>
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default styled(PostPreview)``;
