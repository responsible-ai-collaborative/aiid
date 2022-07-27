import React from 'react';
import { GatsbyImage as Img } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { format } from 'date-fns';
import { LocalizedLink } from 'gatsby-theme-i18n';
import Card from '../../elements/Card';

function PostPreview({ post }) {
  return (
    <Card className="tw-border tw-flex tw-break tw-bg-white tw-rounded tw-flex-row tw-min-w-0 tw-relative">
      <div className="tw-flex tw-flex-col tw-w-full tw-max-w-full tw-w-2/6">
        <LocalizedLink to={post.frontmatter.slug} className="tw-text-primary-blue">
          <Img
            alt="post-image"
            className="img-fluid tw-rounded-start tw-h-full tw-w-full tw-max-w-full tw-max-h-240 tw-rounded-l-lg tw-max-h-[240px]"
            imgStyle={{ transition: '0.5s all ease-in-out' }}
            imgClassName="hover:tw-scale-110 tw-object-cover"
            image={post.frontmatter.image.childImageSharp.gatsbyImageData}
          />
        </LocalizedLink>
      </div>
      <div>
        <div className="tw-p-4">
          <div>
            <LocalizedLink to={post.frontmatter.slug}>{post.fields.title}</LocalizedLink>
          </div>
          <div className="tw-font-medium">
            {format(new Date(post.frontmatter.date), 'MMM d, yyyy')}
          </div>
          <div>
            {' '}
            {post.excerpt}... <LocalizedLink to={post.frontmatter.slug}>(Read More)</LocalizedLink>
          </div>
          <div className="tw-mt-4">
            <small className="tw-text-muted-gray tw-text-sm">By {post.frontmatter.author}</small>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default styled(PostPreview)``;
