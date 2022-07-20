import React from 'react';
import { GatsbyImage as Img } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { format } from 'date-fns';
import { LocalizedLink } from 'gatsby-theme-i18n';
import Card from '../../elements/Card';

function PostPreview({ post }) {
  return (
    <Card className="max-w-full">
      <div className="flex flex-column w-full max-w-full">
        <LocalizedLink to={post.frontmatter.slug}>
          <Img
            style={{ maxHeight: '240px', transitionDuration: '.15s' }}
            alt="post-image"
            className="img-fluid rounded-start h-full w-full max-w-full"
            imgStyle={{ objectFit: 'cover' }}
            image={post.frontmatter.image.childImageSharp.gatsbyImageData}
          />
        </LocalizedLink>
        <div className="p-4">
          <div>
            <LocalizedLink to={post.frontmatter.slug}>{post.fields.title}</LocalizedLink>
          </div>
          <div className="font-medium">
            {format(new Date(post.frontmatter.date), 'MMM d, yyyy')}
          </div>
          <div>
            {' '}
            {post.excerpt}... <LocalizedLink to={post.frontmatter.slug}>(Read More)</LocalizedLink>
          </div>
          <div>
            <small className="text-muted">By {post.frontmatter.author}</small>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default styled(PostPreview)``;
