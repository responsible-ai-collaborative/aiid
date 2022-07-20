import React from 'react';
import { GatsbyImage as Img } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { format } from 'date-fns';
// import { Card, Col, Row } from 'react-bootstrap';
import { LocalizedLink } from 'gatsby-theme-i18n';
import Card from '../../elements/Card';

function PostPreview({ post }) {
  return (
    <Card className="max-w-full">
      <div className="flex flex-column w-full max-w-full">
        <LocalizedLink
          to={post.frontmatter.slug}
          style={{
            height: '100%',
            width: '100%',
            maxWidth: '100%',
            maxHeight: '240px',
            display: 'inline-block',
          }}
        >
          <Img
            style={{ height: '100%', width: '100%', maxWidth: '100%', maxHeight: '240px' }}
            alt="post-image"
            className="img-fluid rounded-start"
            imgStyle={{ objectFit: 'cover' }}
            image={post.frontmatter.image.childImageSharp.gatsbyImageData}
          />
        </LocalizedLink>
        <div className="p-4">
          <div>
            <LocalizedLink to={post.frontmatter.slug}>{post.fields.title}</LocalizedLink>
          </div>
          <div className=" font-medium">
            {format(new Date(post.frontmatter.date), 'MMM d, yyyy')}
          </div>
          <div className="">
            {' '}
            {post.excerpt}... <LocalizedLink to={post.frontmatter.slug}>(Read More)</LocalizedLink>
          </div>
          <div className="">
            <small className="text-muted">By {post.frontmatter.author}</small>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default styled(PostPreview)``;
