import React from 'react';
import { GatsbyImage as Img } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { format } from 'date-fns';
// import { Card, Col, Row } from 'react-bootstrap';
import { LocalizedLink } from 'gatsby-theme-i18n';
import Card from '../../elements/Card';

const StyledImg = styled(Img)`
  height: 100%;
  max-height: 240px;
`;

function PostPreview({ post }) {
  return (
    <Card className="mb-4">
      <div className="grid grid-cols-5 grid-rows-4">
        <div className="row-span-4 col-span-2">
          <LocalizedLink to={post.frontmatter.slug}>
            <StyledImg
              alt="post-image"
              className="img-fluid rounded-start"
              image={post.frontmatter.image.childImageSharp.gatsbyImageData}
            />
          </LocalizedLink>
        </div>
        <div className="grid row-span-4 col-span-3 p-4">
          <div>
            <LocalizedLink to={post.frontmatter.slug}>{post.fields.title}</LocalizedLink>
          </div>
          <div className="col-span-2 font-medium">
            {format(new Date(post.frontmatter.date), 'MMM d, yyyy')}
          </div>
          <div className="col-span-2">
            {' '}
            {post.excerpt}... <LocalizedLink to={post.frontmatter.slug}>(Read More)</LocalizedLink>
          </div>
          <div className="col-span-2">
            <small className="text-muted">By {post.frontmatter.author}</small>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default styled(PostPreview)``;
